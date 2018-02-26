import {forEach, debounce, DebounceSettings} from 'lodash';
import {WebGLRenderer, Scene, Vector2, AxesHelper} from 'three';

import Config, {Configurable} from 'src/lib/types/Config';
import {DomView} from 'src/lib/types/View';

import Camera from 'src/lib/classes/Camera';
import Stats from 'src/lib/classes/Stats';

const debounceSettingsLeading: DebounceSettings = {
  leading: true,
  trailing: false,
};

const debounceSettingsTrailing: DebounceSettings = {
  leading: false,
  trailing: true,
};

interface Helpers {
  axes?: AxesHelper;
}

export class WorldView implements DomView, Configurable {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: Camera;
  private stats: Stats;
  private helpers: Helpers;

  private isAnimating: boolean;

  constructor(
    public element: HTMLElement,
    public config: Config,
    private world: World,
  ) {
    console.log(this.world);

    this.renderer = this.createRenderer();
    this.scene = new Scene();
    this.camera = new Camera(this.element, this.config);
    this.stats = this.createStats();
    this.helpers = this.createHelpers();

    this.isAnimating = false;

    this.animate = this.animate.bind(this);
    this.onResizeLeading = debounce(
      this.onResizeLeading.bind(this),
      this.config.resizeDebouncePeriod,
      debounceSettingsLeading,
    );
    this.onResizeTrailing = debounce(
      this.onResizeTrailing.bind(this),
      this.config.resizeDebouncePeriod,
      debounceSettingsTrailing,
    );
  }

  public mount() {
    if (this.stats) {
      this.stats.mount();
    }

    this.element.appendChild(this.renderer.domElement);
    this.subscribeToDomEvents();
  }

  public unmount() {
    if (this.stats) {
      this.stats.unmount();
    }

    this.element.removeChild(this.renderer.domElement);
    this.unsubscribeFromDomEvents();
  }

  public render() {
    if (this.stats) {
      this.stats.render();
    }

    this.renderer.render(this.scene, this.camera.orthographicCamera);
  }

  public run() {
    this.addHelpers();
    this.playAnimation();
  }

  public reloadConfig() {
    this.camera.reloadConfig();

    if (this.config.debug.stats && !this.stats) {
      this.stats = this.createStats();
      this.stats.mount();
    } else if (!this.config.debug.stats && this.stats) {
      this.stats.unmount();
      this.stats = null;
    }

    this.removeHelpers();
    this.helpers = this.createHelpers();
    this.addHelpers();
  }

  private subscribeToDomEvents() {
    window.addEventListener('resize', this.onResizeLeading);
    window.addEventListener('resize', this.onResizeTrailing);
  }

  private unsubscribeFromDomEvents() {
    window.removeEventListener('resize', this.onResizeLeading);
    window.removeEventListener('resize', this.onResizeTrailing);
  }

  private onResizeLeading() {
    this.pauseAnimation();
  }

  private onResizeTrailing() {
    this.camera.update();
    this.updateRenderer(this.renderer);
    this.playAnimation();
  }

  private animate() {
    if (this.isAnimating) {
      requestAnimationFrame(this.animate);
    }

    this.render();
  }

  private pauseAnimation() {
    this.isAnimating = false;
  }

  private playAnimation() {
    this.isAnimating = true;
    this.animate();
  }

  private createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: this.config.renderer.antialias,
      devicePixelRatio: window.devicePixelRatio,
    });

    this.updateRenderer(renderer);

    return renderer;
  }

  private updateRenderer(renderer: WebGLRenderer) {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.element.clientWidth, this.element.clientHeight);
  }

  private getPositionFromDomCoords(coords: Vector2): Vector2 {
    // NDC (Normalized Device Coordinates: [-1, 1])
    const vector = new Vector2(
      (coords.x / this.element.clientWidth) * 2 - 1,
      -(coords.y / this.element.clientHeight) * 2 + 1,
    );
    const {right, top} = this.camera.getFrustum();

    return vector.multiply(new Vector2(right, top));
  }

  private createStats(): Stats {
    return this.config.debug.stats
      ? new Stats(this.element)
      : null;
  }

  private createHelpers(): Helpers {
    const helpers: Helpers = {};

    if (this.config.debug.helpers.axes) {
      const {x, y} = this.getPositionFromDomCoords(new Vector2(this.renderer.getSize().width, 0));
      helpers.axes = new AxesHelper(Math.max(x, y));
    }

    return helpers;
  }

  private addHelpers() {
    forEach(this.helpers, (helper) => this.scene.add(helper));
  }

  private removeHelpers() {
    forEach(this.helpers, (helper) => this.scene.remove(helper));
  }
}

class World {

}

export default World;

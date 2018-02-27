import {forEach} from 'lodash';
import {WebGLRenderer, Scene, Vector2} from 'three';

import Config, {Configurable} from 'src/lib/types/Config';
import {DomView} from 'src/lib/types/View';

import {debounceLeading, debounceTrailing} from 'src/lib/utils/function';

import Camera from 'src/lib/classes/Camera';
import Stats from 'src/lib/classes/Stats';
import {CenterHelper, MouseHelper} from 'src/lib/classes/ViewHelpers';

interface Helpers {
  center?: CenterHelper;
  mouse?: MouseHelper;
}

export class WorldView implements DomView, Configurable {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: Camera;
  private stats: Stats;
  private mouse: Vector2;
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
    this.stats = this.config.debug.stats
      ? new Stats(this.element)
      : null;
    this.mouse = new Vector2(10, 10);
    this.helpers = this.createHelpers();

    this.isAnimating = false;

    this.animate = this.animate.bind(this);
    this.onResizeLeading = debounceLeading(this.onResizeLeading.bind(this), this.config.resizeFrequency);
    this.onResizeTrailing = debounceTrailing(this.onResizeTrailing.bind(this), this.config.resizeFrequency);
    this.onMouseMove = this.onMouseMove.bind(this);
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
      this.stats = new Stats(this.element);
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
    this.element.addEventListener('mousemove', this.onMouseMove);
  }

  private unsubscribeFromDomEvents() {
    window.removeEventListener('resize', this.onResizeLeading);
    window.removeEventListener('resize', this.onResizeTrailing);
    this.element.removeEventListener('mousemove', this.onMouseMove);
  }

  private onResizeLeading() {
    this.pauseAnimation();
  }

  private onResizeTrailing() {
    this.camera.update();
    this.updateRenderer(this.renderer);
    this.playAnimation();
  }

  private onMouseMove(event: MouseEvent) {
    this.mouse.copy(this.getPositionFromDomCoords(new Vector2(event.offsetX, event.offsetY)));

    if (this.helpers.mouse) {
      this.helpers.mouse.update();
    }
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

  private createHelpers(): Helpers {
    const helpers: Helpers = {};

    if (this.config.debug.helpers.center) {
      const topRight = new Vector2(this.renderer.getSize().width, 0);
      helpers.center = new CenterHelper(this.getPositionFromDomCoords(topRight));
    }

    if (this.config.debug.helpers.mouse) {
      helpers.mouse = new MouseHelper(this.mouse, this.config);
    }

    return helpers;
  }

  private addHelpers() {
    forEach(this.helpers, (helper) => this.scene.add(helper.object));
  }

  private removeHelpers() {
    forEach(this.helpers, (helper) => this.scene.remove(helper.object));
  }
}

class World {

}

export default World;

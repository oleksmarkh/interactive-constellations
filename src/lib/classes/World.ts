import {forEach, debounce, DebounceSettings} from 'lodash';
import {WebGLRenderer, OrthographicCamera, Scene, Vector2, AxesHelper} from 'three';

import Config, {Configurable} from 'src/lib/types/Config';
import {CameraFrustum} from 'src/lib/types/Camera';
import {DomView} from 'src/lib/types/View';

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
  private camera: OrthographicCamera;
  private scene: Scene;
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
    this.camera = this.createCamera();
    this.scene = new Scene();
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

    this.renderer.render(this.scene, this.camera);
  }

  public run() {
    this.addHelpers();
    this.playAnimation();
  }

  public reloadConfig() {
    // @todo: readjust the camera (frustum, position)

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
    this.updateCamera();
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

  private createCamera(): OrthographicCamera {
    const {left, right, top, bottom, near, far} = this.getCameraFrustum();
    const camera = new OrthographicCamera(left, right, top, bottom, near, far);

    camera.position.z = this.config.camera.distance;

    return camera;
  }

  private updateCamera() {
    const {left, right, top, bottom} = this.getCameraFrustum();

    this.camera.left = left;
    this.camera.right = right;
    this.camera.top = top;
    this.camera.bottom = bottom;

    this.camera.updateProjectionMatrix();
  }

  // @see: https://threejs.org/examples/#canvas_camera_orthographic
  private getCameraFrustum(): CameraFrustum {
    const {size, near, far} = this.config.camera.frustum;
    const screenAspectRatio = this.element.clientWidth / this.element.clientHeight;
    const halfWidth = size * screenAspectRatio / 2;
    const halfHeight = size / 2;

    return {
      left: -halfWidth,
      right: halfWidth,
      top: halfHeight,
      bottom: -halfHeight,
      near,
      far,
    };
  }

  private getPositionFromDomCoords(coords: Vector2): Vector2 {
    // NDC (Normalized Device Coordinates: [-1, 1])
    const vector = new Vector2(
      (coords.x / this.element.clientWidth) * 2 - 1,
      -(coords.y / this.element.clientHeight) * 2 + 1,
    );
    const {right, top} = this.getCameraFrustum();

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

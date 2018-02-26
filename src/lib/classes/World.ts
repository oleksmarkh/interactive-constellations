import {debounce, DebounceSettings} from 'lodash';
import {WebGLRenderer, OrthographicCamera, Scene} from 'three';

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

export class WorldView implements DomView, Configurable {
  private renderer: WebGLRenderer;
  private camera: OrthographicCamera;
  private scene: Scene;
  private stats: Stats;

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
    this.playAnimation();
  }

  public reloadConfig(): boolean {
    // @todo: readjust the camera (frustum, position)

    if (this.config.debug.stats && !this.stats) {
      this.stats = this.createStats();
      this.stats.mount();
      return true;
    }

    if (!this.config.debug.stats && this.stats) {
      this.stats.unmount();
      this.stats = null;
      return true;
    }

    return false;
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
    this.setRendererSize(this.renderer);
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

    this.setRendererSize(renderer);

    return renderer;
  }

  private setRendererSize(renderer: WebGLRenderer) {
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

  private createStats(): Stats {
    return this.config.debug.stats
      ? new Stats(this.element)
      : null;
  }
}

class World {

}

export default World;

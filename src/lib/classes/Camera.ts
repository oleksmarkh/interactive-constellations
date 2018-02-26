import {OrthographicCamera} from 'three';

import Config, {Configurable} from 'src/lib/types/Config';
import {CameraFrustum} from 'src/lib/types/Camera';

class Camera implements Configurable {
  public orthographicCamera: OrthographicCamera;

  constructor(
    public element: HTMLElement,
    public config: Config,
  ) {
    const {left, right, top, bottom, near, far} = this.getFrustum();

    this.orthographicCamera = new OrthographicCamera(left, right, top, bottom, near, far);
    this.orthographicCamera.position.z = this.config.camera.distance;
  }

  public reloadConfig() {
    this.orthographicCamera.position.z = this.config.camera.distance;
    this.update();
  }

  // @see: https://threejs.org/examples/#canvas_camera_orthographic
  public getFrustum(): CameraFrustum {
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

  public update() {
    const {left, right, top, bottom} = this.getFrustum();

    this.orthographicCamera.left = left;
    this.orthographicCamera.right = right;
    this.orthographicCamera.top = top;
    this.orthographicCamera.bottom = bottom;

    this.orthographicCamera.updateProjectionMatrix();
  }
}

export default Camera;

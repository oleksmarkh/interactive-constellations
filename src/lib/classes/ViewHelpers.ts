import {Vector2, Vector3, AxesHelper, ArrowHelper} from 'three';

import Config, {Configurable} from 'src/lib/types/Config';

interface Helper {
  object: AxesHelper | ArrowHelper;
}

interface UpdatableHelper extends Helper {
  update: () => void;
}

const center = new Vector3();

export class CenterHelper implements Helper {
  public object: AxesHelper;

  constructor(size: number) {
    this.object = new AxesHelper(size);
    this.object.name = 'axes helper';
  }
}

export class MouseHelper implements UpdatableHelper, Configurable {
  public object: ArrowHelper;

  constructor(
    public mouse: Vector2,
    public config: Config,
  ) {
    this.object = new ArrowHelper(
      (new Vector3(this.mouse.x, this.mouse.y, 0)).normalize(),
      center,
      this.mouse.length(),
      this.config.colors.helpers.mouse,
    );
    this.object.name = 'mouse helper';
  }

  update() {
    this.object.setDirection((new Vector3(this.mouse.x, this.mouse.y, 0)).normalize());
    this.object.setLength(this.mouse.length());
  }

  reloadConfig() {
    this.object.setColor(this.config.colors.helpers.mouse);
  }
}

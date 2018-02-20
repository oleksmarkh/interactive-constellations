import * as Stats from 'stats.js';

import {DomView} from 'src/lib/types/View';
import config from 'src/lib/config';

export class WorldView implements DomView {
  private stats: Stats;

  constructor(
    public element: HTMLElement,
    private world: World,
  ) {
    console.log(this.world);

    this.stats = config.debug.stats
      ? new Stats()
      : null;

    this.animate = this.animate.bind(this);
  }

  public mount() {
    if (this.stats) {
      this.element.appendChild(this.stats.dom);
    }
  }

  public unmount() {
    if (this.stats) {
      this.element.removeChild(this.stats.dom);
    }
  }

  public render() {
    this.animate();
  }

  private animate() {
    requestAnimationFrame(this.animate);

    if (this.stats) {
      this.stats.update();
    }
  }
}

class World {

}

export default World;

import * as Stats from 'stats.js';

import Config, {Configurable} from 'src/lib/types/Config';
import {DomView} from 'src/lib/types/View';

export class WorldView implements DomView, Configurable {
  private stats: Stats;

  constructor(
    public element: HTMLElement,
    public config: Config,
    private world: World,
  ) {
    console.log(this.world);

    this.stats = this.createStats();

    this.animate = this.animate.bind(this);
  }

  public mount() {
    if (this.stats) {
      this.mountStats();
    }
  }

  public unmount() {
    if (this.stats) {
      this.unmountStats();
    }
  }

  public reloadConfig(): boolean {
    if (this.config.debug.stats && !this.stats) {
      this.stats = this.createStats();
      this.mountStats();
      return true;
    }

    if (!this.config.debug.stats && this.stats) {
      this.unmountStats();
      this.stats = null;
      return true;
    }

    return false;
  }

  public render() {
    this.animate();
  }

  private createStats(): Stats {
    return this.config.debug.stats
      ? new Stats()
      : null;
  }

  private mountStats() {
    this.element.appendChild(this.stats.dom);
  }

  private unmountStats() {
    this.element.removeChild(this.stats.dom);
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

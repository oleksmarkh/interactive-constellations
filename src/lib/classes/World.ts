import * as Stats from 'stats.js';

import config from 'src/lib/config';

class World {
  private stats: Stats;

  constructor(
    private element: HTMLElement,
  ) {
    this.stats = null;

    this.animate = this.animate.bind(this);
  }

  public initialize() {
    this.enableDebugFeatures();

    console.log(this.element);
  }

  public run() {
    this.animate();
  }

  private enableDebugFeatures() {
    if (config.debug.stats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  private animate() {
    requestAnimationFrame(this.animate);

    if (this.stats) {
      this.stats.update();
    }
  }
}

export default World;

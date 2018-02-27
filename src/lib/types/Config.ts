interface Config {
  debug: {
    stats: boolean;
    expose: boolean;

    helpers: {
      center: boolean;
      mouse: boolean;
    };
  };

  renderer: {
    antialias: boolean;
  };

  camera: {
    // @see: https://en.wikipedia.org/wiki/Viewing_frustum
    frustum: {
      size: number,
      near: number,
      far: number,
    },
    distance: number,
  };

  resizeFrequency: number;

  colors: {
    helpers: {
      mouse: number,
    },
  },
}

export interface Configurable {
  config: Config;
  reloadConfig: () => void;
}

export default Config;

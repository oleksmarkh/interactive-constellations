interface Config {
  debug: {
    stats: boolean;
    expose: boolean;

    helpers: {
      axes: boolean;
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

  resizeDebouncePeriod: number;
}

export interface Configurable {
  config: Config;
  reloadConfig: () => void;
}

export default Config;

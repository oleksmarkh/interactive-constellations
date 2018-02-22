interface Config {
  debug: {
    stats: boolean;
    expose: boolean;

    helpers: {
      coords: boolean;
    };
  };

  render: {
    antialias: boolean;
  };
}

export interface Configurable {
  config: Config;
  reloadConfig: () => boolean;
}

export default Config;

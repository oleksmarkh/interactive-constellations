import Config from 'src/lib/types/Config';

const config: Config = {
  debug: {
    stats: true,
    expose: true,

    helpers: {
      coords: true,
    },
  },

  renderer: {
    antialias: true,
  },

  camera: {
    frustum: {
      size: 300,
      near: 0.1,
      far: 1000,
    },
    distance: 750,
  },

  resizeDebouncePeriod: 400,
};

export default config;

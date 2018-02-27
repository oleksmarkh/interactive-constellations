import Config from 'src/lib/types/Config';

const config: Config = {
  debug: {
    stats: true,
    expose: true,

    helpers: {
      center: true,
      mouse: true,
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

  resizeFrequency: 400,

  colors: {
    helpers: {
      mouse: 0xaa00aa,
    },
  },
};

export default config;

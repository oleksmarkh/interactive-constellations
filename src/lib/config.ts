import Config from 'src/lib/types/Config';

const config: Config = {
  debug: {
    stats: true,
    expose: true,

    helpers: {
      coords: true,
    },
  },

  render: {
    antialias: true,
  },
};

export default config;

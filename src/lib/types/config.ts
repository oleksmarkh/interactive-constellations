interface HelpersConfig {
  coords: boolean;
}

interface DebugConfig {
  stats: boolean;
  expose: boolean;
  helpers: HelpersConfig;
}

interface Config {
  debug: DebugConfig;
}

export interface Configurable {
  config: Config;
  reloadConfig: () => boolean;
}

export default Config;

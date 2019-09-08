

const config = {
  dev: __DEV__,
  env: __ENV__,
  version: __VERSION__,
  log: __DEV__,
  watch: __WATCH__,

  install(ReactVueLike, { App }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$config = this;
  }
};

export default config;


export default {
  install(ReactVueLike, { App }) {
    // if (!App.inherits) App.inherits = {};
    App.filters = this;
  }
};

import test from './test';

export default {
  test,

  install(ReactVueLike, { App }) {
    // if (!App.inherits) App.inherits = {};
    App.directives = this;
  }
};

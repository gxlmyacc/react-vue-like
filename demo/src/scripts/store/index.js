
import {  Store } from 'react-vue-like';

const store = new Store({
  state: {
    logined: false
  },
  mutations: {
    'update-logined'(state, v) {
      state.logined = v;
    }
  },

  install(ReactVueLike, { App }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$store = this;
  }
});

export default store;

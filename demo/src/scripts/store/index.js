
import ReactVueLike from 'react-vue-like';

const store = new ReactVueLike.Store({
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

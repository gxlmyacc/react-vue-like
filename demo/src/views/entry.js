import ReactDOM from 'react-dom';
import React from 'react';
import config from 'config/config';
import util from 'libs/util';
import filters from 'filters';
import directives from 'directives';
import router from 'router';
import store from 'store';
import App from 'component/app';
import ReactVueLike from 'react-vue-like';

import routes from './pages';

module.exports = async function (param) {
  router.use({ routes });

  // function bb() {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(10), 4000);
  //   });
  // }
  // function* aa() {
  //   console.log('start');
  //   let a = yield action(bb)();
  //   return a;
  // }
  // console.log('aa', await flow(aa)());

  ReactVueLike.use(config, { App });
  ReactVueLike.use(util, { App });
  ReactVueLike.use(router, { App });
  ReactVueLike.use(store, { App });
  ReactVueLike.use(filters, { App });
  ReactVueLike.use(directives, { App });

  router.beforeEach((to, from, next) => {
    if (to) {
      console.log(
        '%croute changed',
        'background-color:#ccc;color:green;font-weight:bold;font-size:14px;',
        to.url, to.query, to.meta, to.redirectedFrom
      );
      return next();
    }
  });

  ReactDOM.render(<App />, document.getElementById('root'));
};

# react-vue-like

[![NPM version](https://img.shields.io/npm/v/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)
[![NPM downloads](https://img.shields.io/npm/dm/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)

write react component like vue, implementation based on mbox@4.

## Support Vue feature

- `props` will transfrom to react's `propTypes` and `defaultProps`
- `components` if tag name has `-` char will be treat as a component that find from self's `components` section or root's `components` section
- `filter`
- `directive`
- `mixin`
- `data`
- `methods`
- `computed`
- `watch`
- `lifecycle`
- `scoped style` if import's style file name has `?scoped`, then it will treat as `scoped style`
- `slot`
- `v-if/v-else-if/v-else`,`v-show`,`v-model`, `v-html`
- `attribute transform` img src attribute string value transform to `require` expression
- `ref` `string ref` transform to `ref function` and set `ref` to `$refs`
- `Vue like props` like `$el`,`$options`,`$parent`,`$root`,`$refs`,`$slots`,`$attrs`
- `Vue like methods` like `$nextTick`,`$set`,`$delete`,`$forceUpdate`,`$watch`,`$emit`,`$on`,`$off`,`$once`,`renderError`, `ReactVueLike.use`, `ReactVueLike.config`
- `attrs inheirt` default ReactVueLike will inherit `className`, `style`, `id`, `disabled` attributes
- `Vuex.Store` see `ReactVueLike.Store`

## Other feature

- `const var` support `__filename`, `__dirname`, `__packagename`, `__packageversion`, `__now`

## Installation

```bash
npm install react-vue-like --save
# or
yarn add react-vue-like
```

## Usage

webpack.config.js:
```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader',
          'react-vue-like/loader',
          ...
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          'react-vue-like/loader',
          ...
        ]
      },
      {
        test: /\.less$/,
        use: [
          'css-loader',
          'react-vue-like/loader',
          ...
        ]
      }
    ]
  }
}
```

babel.config.js
```js
module.exports = {
    presets: [
    '@babel/preset-env',
    'react-vue-like/preset',
    '@babel/preset-react'
  ],
}
```

routes file:
```js
// routes.js
import Test from './test';

const routes = [
  {
    path: '/',
    component: Test
  }
]

export default routes;
```

router file: 
```js
// router.js
import ReactViewRouter from 'react-view-router';
import routes from './routes';

const router = new ReactViewRouter({ routes });

export default router;
```

global filters:
```js
// filters.js
export default {
  myFilter(value) {
    return `myFilter:${value}`;
  }

  install(ReactVueLike, { App }) {
    App.filters = this;
  }
}
```

global directives:
```js
// directives.js
export default {
  test: {
    bind(el, binding, vnode) {

    }
  }

  install(ReactVueLike, { App }) {
    App.directives = this;
  }
}
```

global components:
```js
import * as antd from 'antd';

const PREFIX = 'Ad';
function normalizeComps(comps, parentKey = '') {
  const COMP_REGX = /^[A-Z][A-Za-z]+/;
  let ret = {};
  Object.keys(comps).forEach(key => {
    if (!COMP_REGX.test(key)) return;
    const comp = comps[key];
    ret[`${PREFIX}${parentKey}${key}`] = comp;
    if (!parentKey) Object.assign(ret, normalizeComps(comp, key));
  });
  return ret;
}

// components.js
export default function install(ReactVueLike, { App }) {
  if (!App.components) App.components = {};
  Object.assign(App.components, normalizeComps(antd));
}
```

entry file:

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import ReactVueLike from 'react-vue-like';
import store from './store';
import router from './router';
import filters from './filters';
import directives from './directives';
import components from './components';
import App from 'react-vue-like';

ReactVueLike.use(store, { App });
ReactVueLike.use(router, { App });
ReactVueLike.use(filters, { App });
ReactVueLike.use(directives, { App });
ReactVueLike.use(components, { App });

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

ReactDOM.render(<App />, document.getElementById('#root'));
```

root ReactVueLike component:
```js
  // app.jsx
import React from 'react';
import ReactVueLike from 'react-vue-like';
import { RouterView } from 'react-view-router';
import router from './router';
import SomeComponent from './SomeComponent';
// scoped css
import './app.scss?scoped';

class App extends ReactVueLike {

  static isRoot = true

  static props = {
    aa: {
      type: String
      required: true,
      default: 'a'
    }
  }

  static components = {
    SomeComponent
  }

  static mixins = [
    { 
      methods: {
        mixinMeth() {
          console.log('ddddd');
        }
      }
    }
  ]

  static data() {
    return {
      vif: true,
      vshow: true,
      formData: {
        text: 'aaa'
      },
    };
  }

  static filters = {
    dd(v) {
      return 'dd:' + v;
    },
    aa: {
      bb(v) {
        return 'aa.bb:' + v;
      }
    }
  }

  static directives = {
    test: {
      bind(el, binding, vnode) {
        console.log('bind', el, binding, vnode);
      },
      insert(el, binding, vnode) {
        console.log('insert', el, binding, vnode);
      },
      updated(el, binding, vnode) {
        console.log('updated', el, binding, vnode);
      },
      unbind(el, binding, vnode) {
        console.log('unbind', el, binding, vnode);
      },
    }
  }

  static computed = {
    computedText() {
      return `haha:${this.formData.text}`;
    },
    globalLoading() {
      return this.$store.state.globalLoading;
    },
    aaa: {
      get() {
        return this.vshow;
      },
      set(v) {
        this.vshow = v;
      }
    }
  }

  static watch = {
    vshow(newVal, oldVal) {
      console.log('vshow is changed');
    }
  }

  static methods = {
    func1(v) {
      console.log('dddd', v);
    }
  }

  breforeCreate() {

  }

  created() {

  }

  beforeMount() {

  }

  mounted() {

  }

  beforeUpdate() {

  }

  updated() {

  }

  beforeDestory() {

  }

  render() {
    return (<div class="root">
      
      {/* v-if directive */}
      <span className="dddd" v-if={this.vif}>v-if showing</span>

      {/* v-show directive */}
      <span className={'aa' + ' bb'} v-show={this.vif && this.vshow} style={{ display: 'none' }}>v-show showing</span>

      {/* v-model directive */}
      <input className={callFunc()} v-model={this.formData.text} />
      <input v-model={this.formData.text1} onChange={a => console.log(a)} />

      {/* custom directive */}
      <span v-test_dd$aa$bb={[1,'2',true, null, undefined,
        new Date(1, a), new RegExp(), /dd/i, this.vif, {}, [],
        fun(), (function func1(aa = {}, { dd: cc }, [ dd = 1 ]){ let ee = 1, rr; }), ...ddd,
        a > c ? (b - 1) : (c + 1 ? (c || d ? e ^ d : 11) : true),
        !d, i++, --i,
        { [dd]: 1, cc: 2, get ee(){}, set ee(v){}, rr(){} },
        `11${1}22${3}44`
      ]}>
      </span>

      <Test dd="1" onClick={this.func1} />

      <Test2 v-test2={{ aa: 1 }} />

      {/* custom filter */}
      <span> dd { dd | dd } dd </span>
      <span a={ 11 | cc }> 
        aa { 2 | 'aa.bb.cc'(123, 333) } 
        bb { 11 | dd.cc.ee  } 
        cc { 22 | aa.bb.cc.dd(11) } 
        dd { 33 | bb(bb) } 
        ee { 44 | dd }
      </span>

      {/* will find from components section */}
      <some-component>
        {/* if some-component is `ReactVueLike Component` then it will has `$slots: { header, default, footer }` */}
        {/* if some-component is `React Component` then it will has `header, footer` attributes, default slot will be it's 'children'  */}
        <span slot="header">this is header</span>

        {/* scope slot */}
        <template>
          ({ value, user }) => <span>this is body: {user.name}: {value}</span>
        </template>

        <span slot="footer">this is footer</span>
      </some-component>

      {/* root RouterView need `router` prop */}
      <RouterView router={router} />
    </div>);
  }

}

export default App;
```

```js
  // some-component.jsx
import React from 'react';
import ReactVueLike from 'react-vue-like';
// scoped css
import './some-component.scss?scoped';

class SomeComponent extends ReactVueLike {

  static computed = {
    user() {
      return this.$store.state.user;
    }
  }

  static methods = {
    doSomething() {
      console.log('doSomething');
    }
  }

  // when render throw error, then will call renderError
  renderError(error) {
    return `render has some error:${error.message}`;
  }

  render() {
    return (<div>
      <slot name="header">
      haha1
      {
        [1, 2, 3].map(v => <slot value={v} user={user} />)
      }
      haha2
      <slot name="footer">

      {/* src will be transformed: require('./images/pic1.png') */}
      <img src="./images/pic1.png" />
    </div>);
  }
}
```

```js
  // test.jsx
import React from 'react';
import ReactVueLike from 'react-vue-like';
// scoped css
import './test.scss?scoped';

class Test extends ReactVueLike {

  static computed = {
    user() {
      return this.$store.state.user;
    }
  }

  static methods = {
    test() {
      this.$refs.some.doSomething();
    }
  }

  render() {
    return (<div>
      {/* donot need import,  it will find from it's root component's components section */}
      <some-component ref="some" onClick={this.test} />
    </div>);
  }
}
```

store like Vuex.Store:
```js
import ReactVueLike from 'react-vue-like';

const store = new ReactVueLike.Store({
  modules: {
    child1: {
      state: {
        aa: true
      }
    },
    child2: {
      state: {
        bb: true
      }
    }
  },
  state: {
    user: {
      name: 'name1'
    },
  },
  getters: {
    aa(state) {
      return state.globalLoading;
    }
  }
  mutations: {
    'update-user'(state, v) {
      state.user = v;
    },
    'update-user-info'(state, v) {
      Object.keys(v).forEach(key => state.user[key] = v[key]);
    }
  },
  actions: {
    'update-user-info'({ commit }, v) {
      commit('update-user', v);
    }
  },
});

export default store;
```

## License

[MIT](./LICENSE)

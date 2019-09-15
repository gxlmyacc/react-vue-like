# react-vue-like

[![NPM version](https://img.shields.io/npm/v/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)
[![NPM downloads](https://img.shields.io/npm/dm/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)

write react component like vue, implementation based on mbox@4.

## Support Vue feature

- `props`
- `components`
- `filter`
- `directive`
- `mixin`
- `data`
- `methods`
- `computed`
- `watch`
- `lifecycle`
- `scoped style`
- `slot`
- `v-if`,`v-show`,`v-model`
- `Vuex.Store` see `ReactVueLike.Store`

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

a ReactVueLike component:
```js
  // app.jsx
import React from 'react';
import ReactVueLike from 'react-vue-like';
// scoped css
import 'some.scss?scoped';

class App extends ReactVueLike {

  static props = {
    aa: {
      type: String
      required: true,
      default: 'a'
    }
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
    </div>);
  }

}

export default App;
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
    globalLoading: false,
  },
  getters: {
    aa(state) {
      return state.globalLoading;
    }
  }
  mutations: {
    'update-global-loading'(state, v) {
      state.globalLoading = v;
    }
  },
  actions: {
    'update-global-loading'({ commit }, v) {
      commit('update-global-loading', true);
    }
  }
  install(ReactVueLike, { App }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$store = this;
  }
});

export default store;
```

index.js:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import ReactVueLike from 'react-vue-like';
import store from './store';
import App from './app';

ReactVueLike.use(store, { App })


ReactDOM.render(<App />, document.getElementById('#root'));
```

## License

[MIT](./LICENSE)

# react-vue-like

[![NPM version](https://img.shields.io/npm/v/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)
[![NPM downloads](https://img.shields.io/npm/dm/react-vue-like.svg?style=flat)](https://npmjs.com/package/react-vue-like)

write react component like vue, implementation based on mbox@4.

## Support Vue feature

### `props` 
 will transfrom to react's `propTypes` and `defaultProps`
 example:
 ```js
 class Test extends ReactVueLike {
   static props = {
     aa: {
       type: String,
       default: 'aa',
       required: true,
     },
     bb: Boolean,
   }
 }
```
equals:
 ```js
 import PropTypes from 'prop-types';
 class Test extends ReactVueLike {
   static propTypes = {
     aa: PropTypes.string.isRequired,
     bb: PropTypes.bool
   }
   static defaultProps = {
     aa: 'aa'
   }
 }
```
### `components` 
if tag name has `-` char will be treat as a component that find from self's `components` section or root's `components` section.
 example:
 ```js
 import AComponent from './AComponent';

 class Test extends ReactVueLike {
   static components = {
     AComponent
   }

   render() {
     return (<a-component>dd</a-component>)
   }
 }
```

### `filter`
 example:
 ```js
 class Test extends ReactVueLike {
   static filters = {
     prefix(val, suffix = '') {
       return `test:${val}${suffix}`;
     }
   }

   render() {
     return (<div>
       {// output: test:hello }
       { 'hello' | 'test' }  
       {// output: test:helloa suffix }
       { 'hello' | 'test'('a suffix') }
       </div>);
   }
 }
 ```
  render will output ``

### `directive` 

example:
  ```js
  class Test extends ReactVueLike {
   static directives = {
     test: {
       bind(el, binding, vnode) {

       },
       insert(el, binding, vnode) {

       },
       update(el, binding, vnode) {

       },
       unbind(el, binding, vnode) {

       },
     }
   }

   render() {
     return (<div v-test_arg$aa$bb={1+1}></div>);
   }
 }
  ```
  `v-test_arg$aa$bb={1+1}`, the `binding` will be:
  ```js
   { 
     name: 'test', 
     arg: 'arg',
     value: 2,
     modifiers: {
       aa: true,
       bb: true
     },
     expression: '1+1'
  }
  ```

### `mixin`
 example:
```js
class Test extends ReactVueLike {
  static mixins = [
    {
      data() {
        return {
          text: 'aa',
        };
      },
      methods: {
        test() {
          console.log('test');
        }
      }
    }
  ]
  

  render() {
    return (<div>
      <span onClick={this.test}>{this.text}</span>
    </div>);
  }
}
```
### `data`
 example:
 ```js
 class Test extends ReactVueLike {
   static data() {
     return {
       text: 'aa',
       formData: {
         name: 'dddd'
       }
     }
   }

   render() {
     return (<div>
        <span>{this.text}</span>
        <span>{this.formData.name}</span>
       </div>);
   }
 }
 ```
### `methods`
 example:
 ```js
 class Test extends ReactVueLike {
   static methods = {
     test1() {
       console.log('test1');
     }
   }

   test2() {
      console.log('test2');
   }

   render() {
     return (<div>
        <span onClick={this.test1}>aa</span>
        <span onClick={this.test2}>dd</span>
       </div>);
   }
 }
 ```
### `computed`
 example:
 ```js
 class Test extends ReactVueLike {
   static data() {
     return {
       text: 'aa',
     }
   }

   static computed = {
     test1() {
       return `test1:${this.text}`;
     },
     test2: {
       get() {
         return `test2:${this.text}`;
       },
       set(v) {
         this.text = v;
       }
     }
   }

   render() {
     return (<div>
        <span>{this.text}</span>
        <span>{this.test1}</span>
        <span onClick={() => this.test2 = 'bb'}>{this.test2}</span>
       </div>);
   }
 }
 ```

### `watch`

 example:
 ```js
 class Test extends ReactVueLike {
   static data() {
     return {
       text: 'aa',
     }
   }

   static watch = {
     text(newVal, olVal) {
       console.log('text chagned', newVal, oldVal);
     },
   }

   render() {
     return (<div>
        <span>{this.text}</span>
        <button onClick={() => this.text = 'bb'}>change</button>
       </div>);
   }
 }
 ```

### `lifecycle`

 example:
 ```js
class Test extends ReactVueLike {

  breforeCreate() { }

  created() { }

  beforeMount() { }

  mounted() { }

  beforeUpdate() {  }

  updated() { }

  beforeDestory() { }

  render() {
    return (<div>haha</div>);
  }

}
 ```

### `scoped style` 
  if import's style file name has `?scoped`, then it will treat as `scoped style`
 example:
```js
import React from 'react';
import ReactVueLike from 'react-vue-like';

import './test.scss?scoped';

class Test extends ReactVueLike {

  render() {
    return (<div>haha</div>);
  }

}
```

### `slot`

 example:
```js
import React from 'react';
import ReactVueLike from 'react-vue-like';

class ChildComponent extends ReactVueLike {

  render() {
    return (<div>
      <slot name="header">
      haha1
      {
        [1, 2, 3].map(v => <slot value={v} user={user} />)
      }
      haha2
      <slot name="footer">
    </div>);
  }

}
```

```js
import React from 'react';
import ReactVueLike from 'react-vue-like';
import ChildComponent from './ChildComponent';

class ParentComponent extends ReactVueLike {

  render() {
    return (<ChildComponent>
      {/* if child-component is `ReactVueLike Component` then it will has `$slots: { header, default, footer }` */}
      {/* if child-component is `React Component` then it will has `header, footer` attributes, default slot will be it's 'children'  */}
      <span slot="header">this is header</span>

      {/* scoped slot */}
      <template>
        ({ value, user }) => <span>this is body: {user.name}: {value}</span>
      </template>

      <span slot="footer">this is footer</span>
    </ChildComponent>);
  }

}
```

### `v-if/v-else-if/v-else`,`v-show`,`v-model`, `v-html`

 example:
```js
import React from 'react';
import ReactVueLike from 'react-vue-like';

import './test.scss?scoped';

class Test extends ReactVueLike {

  static data() {
    return {
      vif: true,
      vshow: true,
      text1: '',
      text2: '',
      text3: ''
    }
  }

  render() {
    return (<div>
      <span v-if={this.vif}>v-if showing</span>
      <span v-else>else showing</span>

      <span v-show={this.vshow}>
        v-show showing
      </span>

      <input v-model$trim={this.text1}></input>
      <input type="number" v-model$number={this.text2}></input>
      <input type="number" v-model$lazy={this.text3}></input>

      <span v-html="<a href='#'>dd</a>"></span>
    </div>);
  }

}
```

### `attribute transform` 
  img src attribute string value transform to `require` expression
 example:
```js
class Test extends ReactVueLike {

  render() {
    return (<div>
      { /* src will transform to `require('./image/pic1.png')` */ }
      <img src="./image/pic1.png">
    </div>);
  }

}
```

### `ref` 
`string ref` transform to `ref function` and set `ref` to `$refs`
```js
class Test extends ReactVueLike {
  
  test() {
    this.$refs.some.doSomething();
  }
 
  render() {
    return (<div>
      { /* 
      if ref value is string, then ref value will transform to `ref=>this.$refs.some=ref`, otherwise do nothing.
      */ }
      <SomeComponent ref="some" onClick={this.test}></SomeComponent>
    </div>);
  }

}
```

### `Vue like props` 
like `$el`,`$options`,`$parent`,`$root`,`$refs`,`$slots`,`$attrs`

### `Vue like methods` 
like `$nextTick`,`$set`,`$delete`,`$forceUpdate`,`$watch`,`$emit`,`$on`,`$off`,`$once`,`renderError`, `ReactVueLike.use`, `ReactVueLike.config`

### `attrs inheirt` 
default ReactVueLike component will inherit `className`, `style`, `id`, `disabled` attributes that be defined in it`s parent component

### `class attribute` 
`class attribute` in jsx will transfrom to `className`

### `prop and event modifiers`
see:
  [v-model](https://vuejs.org/v2/api/index.html#v-model)
  [v-bind](https://vuejs.org/v2/api/index.html#v-bind)
  [v-no](https://vuejs.org/v2/api/index.html#v-on)
```js
class Test extends ReactVueLike {
 
  render() {
    return (<div>
      {/* equals <div aa={this.aa} onUpdateAa={v=>this.aa=v}></div> */}
      <div aa$sync={this.aa}></div>
      <div onClick$stop={this.test}></div>
      <div onClick$prevent={this.test}></div>
      <div onClick$capture={this.test}></div>
      <div onClick$self={this.test}></div>
      <div onClick$native={this.test}></div>
      <div onClick$once={this.test}></div>
      <div onClick$left={this.test}></div>
      <div onClick$right={this.test}></div>
      <div onClick$middle={this.test}></div>
      <div onClick$passive={this.test}></div>
      <div onClick$enter={this.test}></div>
      <div onClick$13={this.test}></div>
    </div>);
  }

}
```

### `Vuex.Store` 
see `ReactVueLike.Store`

## Other feature

###  `const var` 
support `__filename`, `__dirname`, `__packagename`, `__packageversion`, `__now`

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

  static data() {
    return {
      formData: {
        text: ''
      }
    };
  }


  static computed = {
    computedText() {
      return `haha:${this.formData.text}`;
    },
  }

  static methods = {
    func1(v) {
      console.log('dddd', v);
    }
  }

  render() {
    return (<div class="root">
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

## Node

1. In ReactVueLike Component, try not to use `this.prop`s, please use `this.$attrs` instead. and you can use `this.$slots.default` instead of `this.props.children`;

2. the `prop name` that bind to ReactVueLike Component, do not begin with '_'or'$' chars, they are recognized as internal values of ReactVueLike. 

3.

## License

[MIT](./LICENSE)

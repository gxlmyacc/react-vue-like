import React from 'react';
import ReactDOM from 'react-dom';
import { extendObservable, observe, when, set, remove } from 'mobx';
import { observer, runInAction } from 'mobx-react';
import {
  isPrimitive, isFalsy, isObject,
  parseExpr, camelize, isFunction, iterativeParent, handleError, defComputed
} from './utils';
import config from './config';
import propcheck from './prop-check';

function generateComputed(obj, propData, data, target) {
  const ret = {};
  Object.keys(obj).forEach(key => {
    if (key in propData) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with props`);
      handleError(e, this, `constructor:${target.name}`);
      throw e;
    }
    if (key in data) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with data()`);
      handleError(e, this, `constructor:${target.name}`);
      throw e;
    }
    const v = obj[key];
    if (isFunction(v)) return defComputed(ret, key, v);
    defComputed(ret, key, v.get, v.set);
  });
  return ret;
}

function bindMethods(ctx, methods) {
  methods && Object.keys(methods).forEach(key => ctx[key] = (methods[key].bind(ctx)));
}

function bindWatch(ctx, watch) {
  if (!watch) return;
  Object.keys(watch).forEach(key => ctx.$watch(key, watch[key]));
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'errorCaptured'
];

const RGEX_EVENT = /on([A-Z]\w+)/;
// const RGEX_SYNC = /^(\w+)\$sync$/;

function initListeners(ctxs, props) {
  let listeners = {};
  const addListener = (key, handler) => {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(handler);
  };
  ctxs.forEach(ctx => {
    LIFECYCLE_HOOKS.forEach(key => {
      const name = `hook:${key}`;
      let handler = ctx[key];
      if (!handler && ctx.prototype && ctx.prototype[key]) handler = ctx.prototype[key];
      if (handler) addListener(name, handler);
    });
  });
  if (props) {
    Object.keys(props).forEach(key => {
      const handler = props[key];
      if (!handler) return;
      let [, eventName] = key.match(RGEX_EVENT) || [];
      if (eventName) addListener(camelize(eventName), handler);
    });
  }
  return listeners;
}

function parseProps(target, props, propTypes) {
  const propData = {};
  const attrs = {};
  if (!propTypes) propTypes = {};
  Object.keys(props).forEach(key => {
    if (propTypes[key]) propData[key] = props[key];
    if (['ref', 'children'].includes(key) || /^[$_]/.test(key)) return;

    if (target.inheritAttrs || target.inheritAttrs === undefined) {
      if (Array.isArray(target.inheritAttrs) && ~target.inheritAttrs.indexOf(key)) return;
      if (config.inheritAttrs.indexOf(key)) return;
    }
    attrs[key] = props[key];
  });
  return { propData, attrs };
}

@observer
class ReactVueLike extends React.Component {

  constructor(_props) {
    super(_props);

    const target = new.target;
    // eslint-disable-next-line
    const { propTypes, mixins, isRoot, isAbstract, inherits } = target;

    if (isRoot) this._isVueLikeRoot = true;
    if (isAbstract) this._isVueLikeAbstract = true;

    this._renderFn = this.render;
    this.render = ReactVueLike.prototype.render;

    const { propData, attrs } = parseProps(target, _props, propTypes);

    this._isVueLike = true;
    this._type = target;
    this._ticks = [];
    this._provides = [];
    this._injects = [];
    this._inherits = inherits ? { ...inherits } : null;
    this._el = null;
    this._mountedPending = [];
    this._isWillMount = false;
    this.$refs = {};
    this.$parent = null;
    this.$root = null;
    this.$children = [];
    this.$attrs = attrs;
    this.$slots = _props.$slots || {};

    extendObservable(this, { _isMounted: false });

    defComputed(this, '$el', () => this._el || (this._el = ReactDOM.findDOMNode(this)), v => {
      throw new Error('ReactVueLike error: $el is readonly!');
    });

    const ctxs = mixins ? [...ReactVueLike.mixins, ...mixins, target] : [...ReactVueLike.mixins, target];

    let _datas = [];
    let _computed = {};
    let _methods = {};
    let _watch = {};
    let _directives = {};
    let _filters = {};
    ctxs.forEach(ctx => {
      if (ctx.filters) Object.assign(_filters, ctx.filters);
      if (ctx.directives) Object.assign(_directives, ctx.directives);
      if (ctx.data) _datas.push(ctx.data);
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) this._provides.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(key => !this._injects.includes(key) && this._injects.push(key));
    });

    extendObservable(this, propData);

    this.$listeners = initListeners(ctxs, _props);
    this.$filters = _filters;
    this.$directives = _directives;

    this._datas = _datas;
    this._propData = propData;
    this._methods = _methods;
    this._computed = _computed;
    this._watch = _watch;

    this.$emit('hook:beforeCreate', _props);

    Object.keys(config.inheritMergeStrategies).forEach(key => {
      let child = this._inherits[key];
      let parent = this[key];
      if (!parent) return;
      if (child) {
        let v = config.inheritMergeStrategies[key](parent, child, this, key);
        if (v !== undefined && v !== child) this._inherits[key] = v;
      } else this._inherits[key] = parent;
    });
  }

  _resolvePropRef() {
    const $ref = this.props.$ref;
    if (!this._isVueLikeAbstract && $ref) {
      if (isObject($ref)) $ref.current = this;
      else if (isFunction($ref)) $ref(this);
    }
  }

  _resolveRef(refName, el, key) {
    this.$refs[refName] = el;
    // if (!key) {
    //   this.$refs[refName] = el;
    //   return;
    // }
    // if (typeof key === 'number') {
    //   if (!this.$refs[refName]) this.$refs[refName] = [];
    //   this.$refs[refName][key] = el;
    //   return;
    // }
    // if (!this.$refs[refName]) this.$refs[refName] = {};
    // this.$refs[refName][key] = el;
  }

  _resolveSlot(slotName, scope, children) {
    let slot = this.$slots[slotName];
    let ret;
    if (Array.isArray(slot)) {
      ret = slot.map((s, i) => (typeof s === 'function' ? s(scope) : s));
      if (!ret.length) ret = null;
    } else ret = typeof slot === 'function' ? slot(scope) : slot;
    return ret || children;
  }

  _resolveSpreadAttrs(tagName, props) {
    if (this._type.inheritAttrs === false) return props;

    let inheritAttrs = Array.isArray(this._type.inheritAttrs)
      ? this._type.inheritAttrs
      : config.inheritAttrs;

    const RETX_DOM = /^[a-z]/;
    let attrs = {};
    const isPrimitiveTag = RETX_DOM.test(tagName);
    inheritAttrs.forEach(key => {
      let v = this.props[key];
      if (isFalsy(v)) return;
      if (key !== 'style' && isPrimitiveTag && !isPrimitive(v)) v = '';
      if (v === true) v = '';
      attrs[key] = v;
    });

    if (attrs.className && props.className && attrs.className !== props.className) {
      let ac = attrs.className.split(' ');
      let pc = props.className.split(' ');
      pc.forEach(c => {
        if (!c) return;
        if (~ac.indexOf(c)) return;
        ac.push(c);
      });
      attrs.className = ac.join(' ');
      delete props.className;
    }
    if (isObject(attrs.style) && isObject(props.style) && attrs.style !== props.style) {
      Object.assign(attrs.style, props.style);
      delete props.style;
    }

    return Object.assign(attrs, props);
  }

  _resolveFilter(filter, filterName) {
    if (!this.$filters) return '';
    try {
      return filter();
    } catch (e) {
      handleError(e, this, `filter:${filterName}`);
      return '';
    }
  }

  _resolveWillMount(beforeMount, mounted) {
    const _pending = () => {
      if (!this._isVueLikeRoot && this.$parent) {
        Object.keys(config.optionMergeStrategies).forEach(key => {
          let ret = config.optionMergeStrategies[key](this.$parent[key], this[key], this, key);
          if (ret !== this[key]) this[key] = ret;
        });
      }
      this.$root = this.$parent ? this.$parent.$root : this;

      this._resolveInherits();
      this._resolveMethods();
      this._resolveData();
      this._resolveComputed();
      this._resolveInject();
      this._resolveWatch();
      this._resolvePropRef();

      this.$emit('hook:created');

      let pending = this._mountedPending;
      this._mountedPending = [];
      pending.forEach(v => v());

      beforeMount && beforeMount();

      this._isMounted = true;
      mounted && this.$nextTick(mounted);
    };

    if (!this.$parent || this.$parent._isWillMount) _pending();
    else this.$parent._mountedPending.push(_pending);
  }

  _resolveInherits() {
    if (!this._isVueLikeRoot && this.$parent) {
      if (this.$parent._inherits) {
        if (!this._inherits) this._inherits = {};
        Object.assign(this._inherits, this.$parent._inherits);
      }
    }
    if (this._inherits) {
      Object.keys(this._inherits).forEach(key => {
        let child = this[key];
        let parent = this._inherits[key];
        const merge = config.inheritMergeStrategies[key];
        let v = merge ? merge(parent, child, this, key) : parent;
        if (v !== undefined) this[key] = v;
      });
    }
  }

  _resolveData() {
    const _data = {};
    this._datas.forEach(data => {
      Object.assign(_data, data.call(this, this.props));
    });

    this.$data = _data;

    let deeps = {};
    let shadows = {};
    Object.keys(_data).forEach(key => {
      if (key in this._propData) {
        let e = new Error(`key '${key}' in data() cannot be duplicated with props`);
        handleError(e, this, `constructor:${this._type.name}`);
        throw e;
      }
      if (key.startsWith('_')) shadows[key] = _data[key];
      else deeps[key] = _data[key];
    });
    extendObservable(this, deeps, {}, { deep: true });
    extendObservable(this, shadows, {}, { deep: false });
  }

  _resolveComputed() {
    let _computed = generateComputed(this._computed, this._propData, this.$data, this._type);
    extendObservable(this, _computed);
  }

  _resolveWatch() {
    bindWatch(this, this._watch);
  }

  _resolveMethods() {
    bindMethods(this, this._methods);
    const pMethods = {};
    Object.getOwnPropertyNames(this._type.prototype)
      .filter(key => ReactVueLike.prototype[key])
      .map(key => isFunction(this[key]) && (pMethods[key] = this[key]));
    bindMethods(this, pMethods);
  }

  _resolveParent() {
    if (!this._isVueLikeRoot) {
      iterativeParent(this, parent => this.$parent = parent, ReactVueLike);
      if (this.$parent) this.$parent.$children.push(this);
    }
  }

  _resolveInject() {
    if (!this.$parent) return;
    try {
      const injects = this._injects;
      const getProvides = vm => {
        const provides = vm && vm._provides;
        if (!provides || !provides.length) return;
        let ret = {};
        provides.forEach(p => Object.assign(ret, isFunction(p) ? p.call(vm) : p));
        return ret;
      };
      if (injects.length) {
        iterativeParent(this, vm => {
          let _provide = getProvides(vm);
          if (_provide) {
            for (let i = injects.length - 1; i; i--) {
              let key = injects[i];
              let v = _provide[key];
              if (v !== undefined) {
                this.$set(this, key, v);
                injects.splice(i, 1);
              }
            }
          }
          return !injects.length;
        }, ReactVueLike);
      }
    } catch (e) {
      handleError(e, this, 'resolveInject');
      throw e;
    }
  }

  _resolveUpdated() {
    this._el = null;
  }

  _resolveDestory() {
    this._flushTicks();

    const $ref = this.props.$ref;
    if (!this._isVueLikeAbstract && $ref) {
      if (isObject($ref)) $ref.current = null;
      else if (isFunction($ref)) $ref(null);
    }

    if (this.$parent) {
      const idx = this.$parent.$children.findIndex(c => c === this);
      if (~idx) this.$parent.$children.splice(idx, 1);
    }
  }

  _flushTicks() {
    if (!this._ticks.length) return;
    const ticks = this._ticks.slice();
    this._ticks = [];
    setTimeout(() => ticks.forEach(v => v()), 0);
  }

  async _callListener(eventName, handlers, args) {
    try {
      if (!handlers) return;
      if (isFunction(handlers)) return await handlers.call(this, ...args);
      let ret;
      for (let handler of handlers) {
        ret = await handler.call(this, ...args);
      }
      return ret;
    } catch (e) {
      handleError(e, this, `$emit:${eventName}`);
      throw e;
    }
  }

  static use(plugin, options = {}) {
    if (!plugin.install) throw Error('ReactVueLike.use error: plugin need has \'install\' method!');
    plugin.install(ReactVueLike, options);
  }

  static config(options = {}) {
    Object.assign(config, options);
  }

  static mixin(m) {
    if (!m) return;
    ReactVueLike.mixins.push(m);
  }

  static isRoot = false;

  static isAbstract = false;

  static inheritAttrs = true;

  static inherits = {}

  static props = {}

  static mixins = []

  static directives = {}

  static filters = {}

  static data(props) {
    return {};
  }

  static provide() {

  }

  static inject = []

  static computed = {}

  static watch = {}

  static methods = {}

  beforeCreate(props = {}) {

  }

  created() {

  }

  beforeMount(props = {}) {

  }

  mounted() {

  }

  beforeUpdate() {
  }

  updated() {

  }

  beforeDestory() {

  }

  errorCaptured(err, vm, info) {

  }

  // $mount(elementOrSelector) {
  //   if (!elementOrSelector) throw new Error('$mount error: elementOrSelector can not be null!');
  //   let el;
  //   if (typeof elementOrSelector === 'string') el = document.getElementById(elementOrSelector);
  //   else if (elementOrSelector instanceof Element) el = elementOrSelector;
  //   else throw new Error(`$mount error: elementOrSelector ${elementOrSelector} is not support type!`);

  //   ReactDOM.render(<App />, el);
  // }

  $runInAction(...args) {
    return runInAction(...args);
  }

  $nextTick(cb, ctx) {
    this._ticks.push(ctx ? cb.bind(ctx) : cb);
  }

  $watch(expOrFn, callback, options = {}) {
    if (!expOrFn || !callback) return;
    callback = callback.bind(this);
    if (typeof expOrFn === 'string') {
      let { obj, key } = parseExpr(this, expOrFn);
      if (obj && key)  {
        return observe(
          obj,
          key,
          change => callback(change.newValue, change.oldValue),
          options.immediate
        );
      }
    } else if (isFunction(expOrFn)) {
      let oldValue;
      return when(() => oldValue !== expOrFn(), callback);
    }
  }

  $computed(target, expr, value, force = false) {
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) {
      if (!force && obj[key]) {
        let e = new Error(`key '${expr}' has aleady exist!`);
        handleError(e, this, `$computed:${expr}`);
        throw e;
      }
      let computedObj = {};
      if (isFunction(value)) defComputed(computedObj, key, value);
      else defComputed(computedObj, key, value.get, value.set);
      extendObservable(obj, computedObj);
    }
  }

  $set(target, expr, value) {
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) set(obj, key, value);
  }

  $delete(target, expr) {
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) remove(obj, key);
  }

  $emit(eventName, ...payload) {
    eventName = camelize(eventName);
    return this._callListener(eventName, this.$listeners[eventName], payload);
  }

  $on(eventName, handler) {
    eventName = camelize(eventName);
    if (!this.$listeners[eventName]) this.$listeners[eventName] = [];
    this.$listeners[eventName].push(handler);
    return () => this.$off(eventName, handler);
  }

  $off(eventName, handler) {
    eventName = camelize(eventName);
    if (handler) {
      const handlers = this.$listeners[eventName];
      if (handlers) {
        const idx = handlers.findIndex(v => v === handler);
        if (~idx) handlers.splice(idx, 1);
      }
      if (handlers.length) return;
    }
    delete this.$listeners[eventName];
  }

  $once(eventName, handler) {
    const off = this.$on(eventName, function (...args) {
      off();
      return handler.call(this, ...args);
    });
  }

  render(...args) {
    if (!this._isMounted) return null;
    let node = this._renderFn && this._renderFn(...args);
    // let el = this.$el;
    // if (el) {
    //   let inheritAttrs = Array.isArray(this._type.inheritAttrs)
    //     ? this._type.inheritAttrs
    //     : config.inheritAttrs;
    //   inheritAttrs.forEach(key => {
    //     let v = this.props[key];
    //     if (!v) return;
    //     switch (key) {
    //       case 'className':
    //         el.classList.add(...(v.split(' ').filter(Boolean)));
    //         break;
    //       case 'style':
    //         if (isObject(v)) Object.assign(el.style, v);
    //         break;
    //       default: //
    //     }
    //   });
    // }
    // console.log('ReactVueLike.render', this._type.name, node);
    return node;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.$emit('hook:beforeUpdate');
    return null;
  }

  componentDidMount() {
    this._resolveParent();
    this._isWillMount = true;

    this._resolveWillMount(
      () => this.$emit('hook:beforeMount'),
      () => this.$emit('hook:mounted')
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this._resolveUpdated();

    this.$emit('hook:updated');

    this._flushTicks();
  }

  componentWillUnmount() {
    this.$emit('hook:beforeDestory');
    this._resolveDestory();
  }

  componentDidCatch(error, info) {
    this.$emit('hook:errorCaptured', error, this, info);
  }

}

ReactVueLike.config.optionMergeStrategies = config.optionMergeStrategies;
ReactVueLike.config.inheritMergeStrategies = config.inheritMergeStrategies;
ReactVueLike.Component = ReactVueLike;

function ReactHook() {
  const _createElement = React.createElement;
  React.createElement = function createElement(Component, props, ...children) {
    if (!Component) return _createElement.call(this, Component, props, ...children);
    if (Component.prototype instanceof ReactVueLike) {
      // eslint-disable-next-line
      if (Component.props && !Component.propTypes) {
        Component = propcheck(Component);
      }
      if (props) {
        if (props.ref) {
          props.$ref = props.ref;
          delete props.ref;
        }
      }
    }
    let newComponent;
    if (Component.beforeConstructor) {
      newComponent = Component.beforeConstructor(props, ...children);
    }
    return _createElement.call(this, newComponent || Component, props, ...children);
  };
}

ReactHook();

export default ReactVueLike;

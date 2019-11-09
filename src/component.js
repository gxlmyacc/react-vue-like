import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { configure } from 'mobx';
import { extendObservable, observe, when, set, remove, action, runInAction } from './mobx';
import {
  isPrimitive, isFalsy, isObject, warn, isProduction,
  parseExpr, camelize, isFunction, iterativeParent, handleError, defComputed
} from './utils';
import config from './config';
import collect from './collect';

function generateComputed(obj, propData, data, methods, target) {
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
    defComputed(ret, key, v.get, action(key, v.set));
  });
  return ret;
}

function bindMethods(ctx, methods) {
  methods && Object.keys(methods).forEach(key => {
    // let method = methods[key].bind(ctx);
    // ctx[key] = action(key, method);
    ctx[key] = methods[key].bind(ctx);
  });
}

function bindWatch(ctx, watch) {
  if (!watch) return [];
  return Object.keys(watch).map(key => ctx.$watch(key, watch[key]));
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeDestroy',
  'destroyed',
  'errorCaptured'
];
const GLOBAL_TYPES = (function () {
  let ret = [React.Component];
  ['EventTarget', 'Event', 'Error', 'Promise',
    'RegExp', 'Location', 'IDBFactory', 'History', 'Screen',
    'Navigator', 'Storage']
    .forEach(key => global[key] && ret.push(global[key]));
  return ret;
})();

const RGEX_EVENT = /^on([A-Z]\w+)/;
const RETX_SPECIAL_KEYS = /^[$_]/;
// const RGEX_SYNC = /^(\w+)\$sync$/;

function initListeners(ctxs, props) {
  let listeners = {};
  const addListener = (key, handler) => {
    if (!listeners[key]) listeners[key] = [];
    if (!isFunction(handler)) {
      console.warn(`[initListeners]${key} is not function!`);
      return;
    }
    listeners[key].push(action(key, handler));
  };
  ctxs.forEach(ctx => {
    LIFECYCLE_HOOKS.forEach(key => {
      const name = camelize(`hook:${key}`);
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
  Object.getOwnPropertyNames(props).forEach(key => {
    if (propTypes[key] !== undefined) return propData[key] = props[key];
    if (['ref', 'children'].includes(key) || RETX_SPECIAL_KEYS.test(key)) return;

    if (target.inheritAttrs || target.inheritAttrs === undefined) {
      if (Array.isArray(target.inheritAttrs) && ~target.inheritAttrs.indexOf(key)) return;
      if (~config.inheritAttrs.indexOf(key)) return;
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


    if (hasOwnProperty.call(target.prototype, 'render')) {
      this._renderFn = collect.wrap(target.prototype.render, this._eachRenderElement.bind(this));
      this.render = ReactVueLike.prototype.render;
    }
    if (hasOwnProperty.call('renderError')) {
      this._renderErrorFn = collect.wrap(target.prototype.renderError, this._eachRenderElement.bind(this));
      this.renderError = ReactVueLike.prototype.renderError;
    }
    this._shouldComponentUpdateFn = this.shouldComponentUpdate;
    this.shouldComponentUpdate = this._shouldComponentUpdate;

    const { propData, attrs } = parseProps(target, _props, propTypes);

    this._isVueLike = true;
    this._ticks = [];
    this._inherits = inherits ? { ...inherits } : null;
    this._el = null;
    this._mountedPending = [];
    this._isWillMount = false;
    this._isActive = true;
    this._isDirty = false;
    this._isRendering = false;
    this.$parent = null;
    this.$root = null;
    this.$children = [];
    this.$attrs = attrs;
    this.$slots = _props.$slots || {};
    this.$ref = _props.$ref || null;
    this.$options = target;

    if (this.$slots.default === undefined) this.$slots.default = _props.children;

    extendObservable(this, { _isMounted: false });
    extendObservable(this, { $refs: {} }, {}, { deep: false });

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
    let _provideFns = [];
    let _injects = [];
    ctxs.forEach(ctx => {
      if (ctx.filters) Object.assign(_filters, ctx.filters);
      if (ctx.directives) Object.assign(_directives, ctx.directives);
      if (ctx.data) _datas.push(ctx.data);
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) _provideFns.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(key => !_injects.includes(key) && _injects.push(key));
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
    this._watched = [];
    this._provideFns = _provideFns;
    this._injects = _injects;

    defComputed(this, '$provides',
      () => {
        if (this._provides) return this._provides;
        let ret = {};
        this._provideFns.forEach(p => Object.assign(ret, isFunction(p) ? p.call(this) : p));
        return this._provides = ret;
      });

    this._inheritMergeStrategies = Object.assign({}, config.inheritMergeStrategies, this.$options.inheritMergeStrategies);
    action(() => {
      Object.keys(this._inheritMergeStrategies).forEach(key => {
        let merge = this._inheritMergeStrategies[key];
        let child = this._inherits[key];
        let parent = this[key];
        if (!parent) return;
        if (child) {
          let v = merge(parent, child, this, key);
          if (v !== undefined && v !== child) this._inherits[key] = v;
        } else this._inherits[key] = parent;
      });
    })();
    this._optionMergeStrategies = Object.assign({}, config.optionMergeStrategies, this.$options.optionMergeStrategies);

    this.$emit('hook:beforeCreate', _props);

    // if (_props.el instanceof Element) this.$mount(_props.el);
  }

  _resolvePropRef(ref) {
    const $ref = this.$ref;
    if ($ref) {
      if (isObject($ref)) $ref.current = ref;
      else if (isFunction($ref)) $ref(ref);
    }
  }

  _resolveRef(refName, el, key) {
    if (!key) {
      this.$refs[refName] = el;
      return;
    }
    if (typeof key === 'number') {
      if (!this.$refs[refName]) this.$refs[refName] = [];
      this.$refs[refName][key] = el;
      return;
    }
    if (!this.$refs[refName]) this.$refs[refName] = {};
    this.$refs[refName][key] = el;
  }

  _resolveSlot(props, children) {
    let slot = this.$slots[props.name || 'default'];
    let ret;
    if (Array.isArray(slot)) {
      ret = React.Children.map(slot, s => (isFunction(s) ? s(props) : s));
      if (!ret.length) ret = null;
    } else ret = isFunction(slot) ? slot(props) : slot;
    return ret || children || null;
  }

  _eachRenderElement(component, props, children, isRoot) {
    if (!component) return;

    if (isRoot) {
      this.$emit('hookBeforeRenderRoot', component, props, children);

      if (this.$options.inheritAttrs !== false) this._resolveRootAttrs(component, props, true);
      if (this._isVueLikeAbstract && this.$ref && props.ref === undefined) {
        props.ref = ref => this._resolvePropRef(ref);
      }
    }

    // let scopeId = this.$options.__scopeId;
    // if (scopeId) {
    //   if (!props.className) props.className = scopeId;
    //   else props.className = `${scopeId} ${props.className}`;
    // }
  }

  _resolveRootAttrs(component, props, isInternal) {
    if (config.useCollect && !isInternal) return props;

    let inheritAttrs = Array.isArray(this.$options.inheritAttrs)
      ? this.$options.inheritAttrs
      : config.inheritAttrs;

    const RETX_DOM = /^[a-z][a-z0-9]*$/;
    const isPrimitiveTag = typeof component === 'string' && RETX_DOM.test(component);

    inheritAttrs.forEach(key => {
      let v = this.props[key];
      if (isFalsy(v)) return;
      switch (key) {
        case 'className':
          if (props.className) {
            if (v !== props.className) props.className = `${v} ${props.className}`;
          } else props.className = v;
          break;
        case 'style':
          if (props.style) {
            if (v !== props.style) props.style = Object.assign({}, v, props.style);
          } else props.style = v;
          break;
        default:
          if (props[key] !== undefined) return;
          if (v === true || (isPrimitiveTag && !isPrimitive(v))) v = '';
          props[key] = v;
      }
      return props;
    });
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
    let _pending = action(() => {
      if (!this._isVueLikeRoot && this.$parent) {
        Object.keys(this._optionMergeStrategies).forEach(key => {
          let ret = this._optionMergeStrategies[key](this.$parent[key], this[key], this, key);
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
      if (!this._isVueLikeAbstract) this._resolvePropRef(this);

      this.$emit('hook:created');

      let pending = this._mountedPending;
      this._mountedPending = [];
      pending.forEach(v => v());

      beforeMount && beforeMount();

      this._isMounted = true;
      mounted && this.$nextTick(mounted);
    });

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
      action(() => {
        Object.keys(this._inherits).forEach(key => {
          let child = this[key];
          let parent = this._inherits[key];
          const merge = this._inheritMergeStrategies[key];
          let v = merge ? merge(parent, child, this, key) : parent;
          if (v !== undefined) this[key] = v;
        });
      })();
    }
  }

  _resolveEvent(handler) {
    if (!handler) return handler;
    return action(handler);
  }

  _resolveData() {
    const _data = {};
    this._datas.forEach(data => {
      Object.assign(_data, data.call(this, this.props));
    });

    this.$data = _data;

    let isPrimitiveObj = v => {
      if (v) {
        if (React.isValidElement(v)) return true;
        if (Object.getPrototypeOf(v) !== Object && GLOBAL_TYPES.some(t => v instanceof t)) return true;
      }
    };

    let keys = Object.keys(_data);
    let _shadows = this.$options.__shadows;
    if (!_shadows) {
      this.$options.__shadows = _shadows = keys
        .filter(key => {
          if (key in this._propData) {
            let e = new Error(`key '${key}' in data() cannot be duplicated with props`);
            handleError(e, this, `constructor:${this.$options.name}`);
            throw e;
          }
          return RETX_SPECIAL_KEYS.test(key) || isPrimitiveObj(_data[key]);
        });
    }

    let deeps = {};
    let shadows = {};
    keys.forEach(key => {
      if (~_shadows.indexOf(key)) shadows[key] = _data[key];
      else deeps[key] = _data[key];
    });
    extendObservable(this, deeps, {}, { deep: true });
    extendObservable(this, shadows, {}, { deep: false });
  }

  _resolveComputed() {
    let _computed = generateComputed(this._computed, this._propData, this.$data, this._methods, this.$options);
    extendObservable(this, _computed);
  }

  _resolveWatch() {
    this._watched = bindWatch(this, this._watch);
  }

  _resolveMethods() {
    bindMethods(this, this._methods);
    const pMethods = {};
    Object.getOwnPropertyNames(this.$options.prototype)
      .filter(key => !ReactVueLike.prototype[key])
      .map(key => isFunction(this[key]) && (pMethods[key] = this[key]));
    bindMethods(this, pMethods);
  }

  _resolveParent() {
    if (this._isVueLikeRoot) return;
    iterativeParent(this, vm => !vm._isVueLikeAbstract && (this.$parent = vm), ReactVueLike);
    if (this.$parent) this.$parent.$children.push(this);
    else if (this.props.$parent) this.$parent = this.props.$parent;
  }

  _resolveInject() {
    if (!this.$parent) return;
    try {
      const injects = this._injects.slice();
      if (injects.length) {
        iterativeParent(this, vm => Object.keys(vm.$provides).some(key => {
          let idx = injects.indexOf(key);
          if (~idx) {
            let v = vm.$provides[key];
            if (v !== undefined) this.$set(this, key, v);
            injects.splice(idx, 1);
          }
          return !injects.length;
        }), ReactVueLike);
        if (process.env.NODE_ENV !== 'production') {
          injects.forEach(key => warn(`inject '${key}' not found it's provide!`, this));
        }
      }
    } catch (e) {
      handleError(e, this, 'resolveInject');
      throw e;
    }
  }

  _resolveComp(compName) {
    let comp;
    if (this.$options.components) comp = this.$options.components[compName];
    if (!this._isVueLikeRoot && !comp && this.$root.$options.components) {
      comp = this.$root.$options.components[compName];
    }

    if (!isProduction && !comp) warn(`can not resolve component '${compName}'!`, this);
    return comp || compName;
  }

  _resolveUpdated() {
    this._el = null;
  }

  _resolveDestroy() {
    this._flushTicks();

    this._watched.forEach(v => v && v());

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

  _callListener(eventName, handlers, args) {
    try {
      if (!handlers) return;
      if (isFunction(handlers)) return handlers.call(this, ...args);
      let ret;
      for (let handler of handlers) {
        ret = handler.call(this, ...args);
      }
      return ret;
    } catch (e) {
      handleError(e, this, `$emit:${eventName}`);
      throw e;
    }
  }

  _shouldComponentUpdate(nextProps, nextState) {
    if (this._isActive) {
      this._isDirty = false;
      return this._shouldComponentUpdateFn(nextProps, nextState);
    }
    this._isDirty = true;
    return false;
  }

  static use(plugin, options = {}, ...args) {
    let install = isFunction(plugin)
      ? plugin
      : plugin.install
        ? plugin.install.bind(plugin)
        : null;
    if (!install) throw Error('ReactVueLike.use error: plugin need has \'install\' method!');
    return install(ReactVueLike, options, ...args);
  }

  static config(options = {}) {
    Object.assign(config, options);
    if (config.enforceActions !== undefined) {
      configure({ enforceActions: config.enforceActions ? 'observed' : 'never' });
    }
  }

  static mixin(m) {
    if (!m) return;
    ReactVueLike.mixins.push(m);
  }

  static isRoot = false;

  static isAbstract = false;

  static inheritAttrs = true;

  static inheritMergeStrategies = {}

  static inherits = {}

  static props = {}

  static components = {}

  static mixins = []

  static directives = {}

  static filters = {}

  static data(props) {
    return {};
  }

  static provide() {
    return {};
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

  activated() {

  }

  deactivated() {

  }

  beforeDestory() {

  }

  errorCaptured(err, vm, info) {

  }

  $mount(elementOrSelector) {
    if (!elementOrSelector) throw new Error('$mount error: elementOrSelector can not be null!');
    let el;
    let sc = false;
    if (typeof elementOrSelector === 'string') el = document.getElementById(elementOrSelector);
    else if (elementOrSelector instanceof Element) el = elementOrSelector;
    else {
      el = document.createElement('div');
      sc = true;
    }
    // throw new Error(`$mount error: elementOrSelector ${elementOrSelector} is not support type!`);
    let instance = this;
    const ReactVueLikeProxy = function ReactVueLikeProxy(props) {
      return instance;
    };
    ReactVueLikeProxy.prototype = React.Component.prototype;
    ReactVueLikeProxy.dispalyName = this.$options.dispalyName || this.$options.name;
    ReactDOM.render(React.createElement(ReactVueLikeProxy, this.props), el);
    return sc ? el : instance;
  }

  $destroy() {
    ReactDOM.unmountComponentAtNode(this.$el);
  }

  $forceUpdate() {
    return this.forceUpdate();
  }

  $runAction(...args) {
    return runInAction(...args);
  }

  $nextTick(cb, ctx) {
    if (!cb) return new Promise(resolve => this._ticks.push(action(resolve)));
    if (ctx) cb = cb.bind(ctx);
    this._ticks.push(action(cb));
  }

  $watch(expOrFn, callback, options = {}) {
    if (!expOrFn || !callback) return;
    callback = action(callback.bind(this));
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
    if (isObject(expr)) return set(target, expr);
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) set(obj, key, value);
  }

  $delete(target, expr) {
    if (isObject(expr)) {
      return Object.keys(expr).forEach(key => this.$delete(target, expr[key]));
    }
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
        const idx = handlers.findIndex((v => (v === handler) || (v === handler._source)));
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

  render() {
    if (!this._isMounted) return null;
    let node;
    this._isRendering = true;
    try {
      node = (this._renderFn && this._renderFn()) || null;
    } catch (ex) {
      handleError(ex, this, 'render');
      node = this.renderError && this.renderError(ex);
    }
    this._isRendering = false;
    return node;
  }

  renderError(ex) {
    let node = null;
    try {
      node = (this._renderErrorFn && this._renderErrorFn(ex)) || null;
    } catch (ex) {
      handleError(ex, this, 'renderError');
    }
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

  componentDidActivate() {
    if (this._isActive) return;
    this._isActive = true;
    this.$emit('hook:activated');
    if (this._isDirty) this.$forceUpdate();
  }

  componentWillUnactivate() {
    if (!this._isActive) return;
    this._isActive = false;
    this.$emit('hook:deactivated');
  }

  componentWillUnmount() {
    this.$emit('hook:beforeDestroy');
    this._resolveDestroy();
  }

  componentDidCatch(error, info) {
    this.$emit('hook:errorCaptured', error, this, info);
  }

}

ReactVueLike.config.optionMergeStrategies = config.optionMergeStrategies;
ReactVueLike.config.inheritMergeStrategies = config.inheritMergeStrategies;
ReactVueLike.runAction = runInAction;
ReactVueLike.set = ReactVueLike.prototype.set;
ReactVueLike.delete = ReactVueLike.prototype.delete;

export default ReactVueLike;

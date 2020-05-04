import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { isObservable, extendObservable, observe, when, set, remove, action, runInAction, observable } from './mobx';
import {
  isPrimitive, isFalsy, isObject, isPlainObject, warn, isProduction, innumerable, VUE_LIKE_CLASS,
  parseExpr, camelize, isFunction, iterativeParent, handleError, defComputed, mergeObject
} from './utils';
import config from './config';

function checkUnmount(fn) {
  if (!fn) return fn;
  let old;
  return function get() {
    if (this && this.$isWillUnmount) return old;
    return old = fn.apply(this, arguments);
  };
}

function generateComputed(obj, propData, data, methods, target) {
  const ret = {};
  Object.keys(obj).forEach(key => {
    if (RESERVED_KEYS.includes(key)) {
      let e = new Error(`key '${key}' in computed is reserved keywords`);
      handleError(e, this, `generateComputed:${target.name}`);
      throw e;
    }
    if (key in propData) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with props`);
      handleError(e, this, `generateComputed:${target.name}`);
      throw e;
    }
    if (key in data) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with data()`);
      handleError(e, this, `generateComputed:${target.name}`);
      throw e;
    }
    const v = obj[key];
    if (isFunction(v)) return defComputed(ret, key, checkUnmount(v));
    defComputed(ret, key, checkUnmount(v.get), v.set ? action(key, v.set) : undefined);
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
  return watch.map(({ key, value }) => ctx.$watch(key, value));
}

const RESERVED_KEYS = ['state', 'props'];

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

const addListener = function (listeners, key, handler) {
  if (!listeners[key]) listeners[key] = [];
  if (!isFunction(handler)) {
    if (Array.isArray(handler)) return handler.forEach(h => addListener(listeners, key, h));
    console.warn(`[addListener]${key} is not function!`);
    return;
  }
  listeners[key].push(action(key, handler));
};

function initListeners(ctxs, props) {
  let listeners = {};
  ctxs.forEach(ctx => {
    LIFECYCLE_HOOKS.forEach(key => {
      const name = camelize(`hook:${key}`);
      let handler = ctx[key];
      if (!handler && ctx.prototype && ctx.prototype[key]) handler = ctx.prototype[key];
      if (handler) addListener(listeners, name, handler);
    });
  });
  if (props) {
    Object.keys(props).forEach(key => {
      const handler = props[key];
      if (!handler) return;
      let [, eventName] = key.match(RGEX_EVENT) || [];
      if (eventName) addListener(listeners, camelize(eventName), handler);
    });
  }
  return listeners;
}

function parseProps(target, propTypes) {
  const propData = {};
  const attrs = {};
  if (!propTypes) propTypes = {};
  Object.getOwnPropertyNames(this.props).forEach(key => {
    if (propTypes[key] !== undefined) return defComputed(propData, key, () => this.props[key]);
    if (['ref'].includes(key) || RETX_SPECIAL_KEYS.test(key)) return;

    if (target.inheritAttrs || target.inheritAttrs === undefined) {
      if (Array.isArray(target.inheritAttrs) && ~target.inheritAttrs.indexOf(key)) return;
      if (~config.inheritAttrs.indexOf(key)) return;
    }
    defComputed(attrs, key, () => this.props[key], null, { enumerable: key !== 'children' });
  });
  return { propData, attrs };
}

@observer
class ReactVueLikeComponent extends React.Component {

  constructor(_props) {
    super(_props);

    const target = new.target;

    this._createInstance(_props, target);
  }

  _createInstance(props, target, wrapper) {
    // eslint-disable-next-line
    const { propTypes, mixins, isRoot, isAbstract, inherits = {} } = target;
    if (wrapper && wrapper.inherits) Object.assign(inherits, wrapper.inherits);
  
    if (isRoot) {
      this._isVueLikeRoot = true;
    }
    if (isAbstract) this._isVueLikeAbstract = true;
  
    this._shouldComponentUpdateFn = this.shouldComponentUpdate;
    this.shouldComponentUpdate = this._shouldComponentUpdate;
  
    const { propData, attrs } = parseProps.call(this, target, propTypes);
  
    this._isVueLike = true;
    this._ticks = [];
    this._el = null;
    this._mountedPending = [];
    this._isWillMount = false;
    this._isWillUnmount = false;
    this._isActive = true;
    this._isDirty = false;
    this._isRendering = false;
    this.$parent = null;
    this.$context = null;
    this.$root = null;
    this.$children = [];
    this.$attrs = attrs;
    this.$slots = props.$slots || {};
    this.$ref = props.$ref || null;
    this.$options = target;
    if (isRoot && isRoot.isVueLike) this.$vuelike = isRoot;
  
    if (this.$slots.default === undefined) this.$slots.default = props.children;

  
    defComputed(this, '$el', () => this._el || (this._el = ReactDOM.findDOMNode(this)), v => {
      throw new Error('ReactVueLike.Component error: $el is readonly!');
    });
  
    const ctxs =  [];
    if (this.$vuelike) {
      ctxs.push(this.$vuelike);
      Array.prototype.push.apply(ctxs, this.$vuelike.plugins.map(p => p.plugin));
    }
    ctxs.push(target);
    if (wrapper) ctxs.push(wrapper);
    if (mixins) Array.prototype.push.apply(ctxs, mixins);
  
    let _datas = [];
    let _computed = {};
    let _methods = {};
    let _watch = [];
    let _directives = {};
    let _filters = {};
    let _provideFns = [];
    let _injects = [];
    let _components = {};
    ctxs.forEach(ctx => {
      if (!ctx) return;
      if (ctx.components) Object.assign(_components, ctx.components);
      if (ctx.filters) mergeObject(_filters, ctx.filters);
      if (ctx.directives) Object.assign(_directives, ctx.directives);
      if (ctx.data) _datas.push(ctx.data);
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.keys(ctx.watch).forEach(key => _watch.push({ key, value: ctx.watch[key] }));
      if (ctx.provide) _provideFns.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(key => !_injects.includes(key) && _injects.push(key));
    });
  
    extendObservable(this, propData);
  
    this.$listeners = initListeners(ctxs, props);
  
    this.$components = _components;
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

    const _inherits = { ...inherits };
    if (this.$vuelike) {
      _inherits.$vuelike = this.$vuelike;
      Object.assign(_inherits, this.$vuelike.inherits);
    }
    extendObservable(this, {
      _isMounted: false,
      _inherits: observable.object(_inherits, {}, { deep: false }),
      $refs: {}
    }, {}, { deep: false });
  
    defComputed(this, '$provides',
      () => {
        if (this._provides) return this._provides;
        let ret = {};
        this._provideFns.forEach(p => Object.assign(ret, isFunction(p) ? p.call(this) : p));
        return this._provides = ret;
      });
    defComputed(this, '$isWillUnmount', () => this._isWillUnmount || Boolean(this.parent && this.parent.$isWillUnmount));
  
  
    this.$emit('hook:beforeCreate', props);
  
    // if (props.el instanceof Element) this.$mount(props.el);
  }

  _willUnmount() {
    this._isWillUnmount = true;
  }

  _resolvePropRef(ref) {
    const $ref = this.$ref;
    if ($ref) {
      if (isObject($ref)) $ref.current = ref;
      else if (isFunction($ref)) $ref(ref);
    }
  }

  _resolveRef(refName, el, key) {
    if (el) el.__vuelike__ = this;
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

    // if (component.__vuelikeAsyncClass && props.vm === undefined) props.vm = this;

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
          if (/* v === true || */(isPrimitiveTag && !isPrimitive(v))) v = '';
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
      this.$root = this.$context ? this.$context.$root : this;

      this._resolveStrategies();
      this._resolveInherits();
      this._resolveEvents();
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

    if (!this.$context || this.$context._isWillMount) _pending();
    else this.$context._mountedPending.push(_pending);
  }

  _resolveEvents() {
    if (!this.$vuelike) return;
    let events = {};
    if (this._isVueLikeRoot) Object.assign(events, this.$vuelike.events.app);
    Object.assign(events, this.$vuelike.events.components);
    Object.keys(events).forEach(eventName => addListener(this.$listeners, eventName, events[eventName]));
  }

  _resolveStrategies() {
    let $vuelike = this.$vuelike || (this.$context && this.$context.$vuelike) || { config: {} };
    this._optionMergeStrategies = Object.assign(
      {}, 
      config.optionMergeStrategies, 
      $vuelike.config.optionMergeStrategies,
      this.$options.optionMergeStrategies
    );
    
    if (!this._isVueLikeRoot && this.$context) {
      Object.keys(this._optionMergeStrategies).forEach(key => {
        let child = this[key];
        if (child === undefined) return;
        let ret = this._optionMergeStrategies[key](this.$context[key], child, this, key);
        if (ret !== child) this[key] = ret;
      });
    }
  }

  _resolveInherits() {
    if (!this._isVueLikeRoot && this.$context) {
      if (this.$context._inherits) {
        if (!this._inherits) this._inherits = {};
        Object.assign(this._inherits, this.$context._inherits);
      }
    }
    if (this._inherits) {
      action(() => {
        let res = {};
        Object.keys(this._inherits).forEach(key => {
          let child = this[key];
          let parent = this._inherits[key];
          const merge = this._optionMergeStrategies[key];
          let v = merge ? merge(parent, child, this, key) : parent;
          if (v !== undefined && v !== child) {
            if (child) this.$set(this, key, v);
            else defComputed(
              res,
              key,
              () => this._inherits[key],
              v => this._inherits[key] = v
            );
          }
        });
        extendObservable(this, res, {}, { deep: false });
      })();
    }
  }

  _resolveAction(handler) {
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
          if (RESERVED_KEYS.includes(key)) {
            let e = new Error(`key '${key}' in data() is reserved keywords`);
            handleError(e, this, `_resolveData:${this.$options.name}`);
            throw e;
          }
          if (key in this._propData) {
            let e = new Error(`key '${key}' in data() cannot be duplicated with props`);
            handleError(e, this, `_resolveData:${this.$options.name}`);
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
      .filter(key => !ReactVueLikeComponent.prototype[key])
      .map(key => isFunction(this[key]) && (pMethods[key] = this[key]));
    bindMethods(this, pMethods);
  }

  _resolveParent() {
    if (this._isVueLikeRoot) return;
    if (this.props.$parent) this.$parent = this.props.$parent;
    else iterativeParent(this, vm => !vm._isVueLikeAbstract && (this.$parent = vm), vm => vm._isVueLike);
    this.$context = this.props.$context || this.$parent;
    if (this.$parent) this.$parent.$children.push(this);
  }

  _resolveInject() {
    if (!this.$context) return;
    try {
      const injects = this._injects.slice();
      if (injects.length) {
        iterativeParent(this.$context, vm => Object.keys(vm.$provides).some(key => {
          let idx = injects.indexOf(key);
          if (~idx) {
            let v = vm.$provides[key];
            if (v !== undefined) this.$set(this, key, v);
            injects.splice(idx, 1);
          }
          return !injects.length;
        }), vm => vm._isVueLike, true);
        // if (process.env.NODE_ENV !== 'production') {
        //   injects.forEach(key => warn(`inject '${key}' not found it's provide!`, this));
        // }
      }
    } catch (e) {
      handleError(e, this, 'resolveInject');
      throw e;
    }
  }

  _resolveComp(compName) {
    let comp;
    if (this.$components) comp = this.$components[compName];
    if (!this._isVueLikeRoot && !comp && this.$root.$components) {
      comp = this.$root.$components[compName];
    }

    if (!isProduction && !comp) warn(`can not resolve component '${compName}'!`, this);
    return comp || compName;
  }

  _resolveUpdated() {
    this._el = null;
  }

  _resolveDestroy() {
    // this._flushTicks();

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

    const el = this.$el;
    if (el && el.__vuelike__) delete el.__vuelike__;
  }

  _flushTicks() {
    if (!this._ticks.length) return;
    const ticks = this._ticks.slice();
    this._ticks = [];
    setTimeout(() => ticks.forEach(v => v()), 0);
  }

  _callProto(key, args) {
    let fn = this.$options.vuelikeProto[key];
    return fn && fn.apply(this, args);
  }

  _callListener(eventName, handlers, args) {
    const map = {
      hookMounted: 'componentDidMount',
      hookBeforeUpdate: 'getSnapshotBeforeUpdate',
      hookUpdated: 'componentDidUpdate',
      hookActivated: 'componentDidActivate',
      hookDeactivated: 'componentWillUnactivate',
      hookBeforeDestroy: 'componentWillUnmount',
      hookErrorCaptured: 'componentDidCatch',
    };
    try {
      if (!handlers) return;
      if (isFunction(handlers)) return handlers.call(this, ...args);
      let ret;
      for (let handler of handlers) {
        ret = handler.call(this, ...args, ret);
      }

      let protoEventName = map[eventName];
      if (protoEventName && this.$options.vuelikeProto[protoEventName]) {
        ret = this.$options.vuelikeProto[protoEventName].apply(this, args);
      }
    
      return ret;
    } catch (e) {
      handleError(e, this, `$emit:${eventName}`);
      throw e;
    }
  }

  _checkActive(callback, args) {
    if (this._isActive && !this.$isWillUnmount) {
      this._isDirty = false;
      return callback.apply(this, args);
    }
    this._isDirty = true;
  }

  _shouldComponentUpdate(nextProps, nextState) {
    let ret1 = this._checkActive(this._shouldComponentUpdateFn, [nextProps, nextState]);
    let shouldComponentUpdate1 = this.$options.vuelikeProto.shouldComponentUpdate;
    let ret2 = !shouldComponentUpdate1 || shouldComponentUpdate1(nextProps, nextState);
    return Boolean(ret1 || ret2);
  }

  static isRoot = false;

  static isAbstract = false;

  static inheritAttrs = true;

  static inheritMergeStrategies = {}

  static props = {}

  static components = {}

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

  // $mount(elementOrSelector) {
  //   if (!elementOrSelector) throw new Error('$mount error: elementOrSelector can not be null!');
  //   let el;
  //   let sc = false;
  //   if (typeof elementOrSelector === 'string') el = document.getElementById(elementOrSelector);
  //   else if (elementOrSelector instanceof Element) el = elementOrSelector;
  //   else {
  //     el = document.createElement('div');
  //     sc = true;
  //   }
  //   // throw new Error(`$mount error: elementOrSelector ${elementOrSelector} is not support type!`);
  //   let instance = this;
  //   const ReactVueLikeProxy = function ReactVueLikeProxy(props) {
  //     return instance;
  //   };
  //   ReactVueLikeProxy.prototype = React.Component.prototype;
  //   ReactVueLikeProxy.dispalyName = this.$options.dispalyName || this.$options.name;
  //   ReactDOM.render(React.createElement(ReactVueLikeProxy, this.props), el);
  //   return sc ? el : instance;
  // }

  $destroy() {
    ReactDOM.unmountComponentAtNode(this.$el);
  }

  $runAction(...args) {
    return runInAction(...args);
  }

  $nextTick(cb, ctx) {
    if (!cb) return new Promise(resolve => this._ticks.push(action(resolve)));

    if (!Array.isArray(cb)) cb = [cb];
    cb.forEach((c, i) => cb[i] = action(ctx ? c.bind(ctx) : c));

    this._ticks.push(...cb);
    setTimeout(() => this._flushTicks(), 0);
  }

  $watch(expOrFn, callback, options = {}) {
    if (!expOrFn || !callback) return;
    callback = action(checkUnmount(callback).bind(this));
    if (options.deep && options.deep !== undefined) console.warn('$watch not support deep option!');
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
      return when(() => {
        let newValue = expOrFn();
        let ret = oldValue !== newValue;
        oldValue = newValue;
        return ret;
      }, callback);
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
      if (isFunction(value)) defComputed(computedObj, key, checkUnmount(value));
      else defComputed(computedObj, key, checkUnmount(value.get), value.set);
      extendObservable(obj, computedObj);
    }
  }

  $set(target, expr, value) {
    if (!isObservable(target)) {
      if (isPlainObject(expr)) return Object.assign(target, expr);
      let { obj, key } = parseExpr(target, expr);
      if (obj && key) obj[key] = value;
      return;
    }
    if (isPlainObject(expr)) {
      const _expr = {};
      Object.keys(expr).forEach(key => {
        value = expr[key];
        if (value && !isObservable(value) && (isPlainObject(value) || Array.isArray(value))) value = observable(value);
        _expr[key] = value;
      });
      return runInAction(() => set(target, _expr));
    }
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) {
      if (value && !isObservable(value) && (isPlainObject(value) || Array.isArray(value))) value = observable(value);
      runInAction(() => set(obj, key, value));
    }
  }

  $delete(target, expr) {
    if (isObject(expr)) {
      return Object.keys(expr).forEach(key => remove(target, expr[key]));
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
      let renderFn = this.$options.vuelikeProto.render;
      node = (renderFn && renderFn.call(this)) || null;
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
      let _renderErrorFn = this.$options.vuelikeProto.renderError;
      node = (_renderErrorFn && _renderErrorFn.call(this, ex)) || null;
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
      () => this.$emit('hook:mounted'),
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this._resolveUpdated();

    const ret = this.$emit('hook:updated');

    this._flushTicks();

    return ret;
  }

  componentDidActivate() {
    if (this._isActive) return;
    this._isActive = true;
    const ret = this.$emit('hook:activated');
    if (this._isDirty) this.forceUpdate();
    return ret;
  }

  componentWillUnactivate() {
    if (!this._isActive) return;
    this._isActive = false;
    return this.$emit('hook:deactivated');
  }

  componentWillUnmount() {
    const ret = this.$emit('hook:beforeDestroy');
    this._resolveDestroy();
    return ret;
  }

  componentDidCatch(error, info) {
    return this.$emit('hook:errorCaptured', error, this, info);
  }

}

const ALIAS_METHODS = {
  _resolveComp: '_c',
  _resolveAction: '_a',
  _resolveRef: '_r',
  _resolveFilter: '_f',
  _resolveRootAttrs: '_o',
  _resolveSlot: '_s',
};
Object.keys(ALIAS_METHODS).forEach(key => innumerable(
  ReactVueLikeComponent.prototype, 
  ALIAS_METHODS[key], 
  ReactVueLikeComponent.prototype[key]
));

innumerable(ReactVueLikeComponent, VUE_LIKE_CLASS, true);

export default ReactVueLikeComponent;

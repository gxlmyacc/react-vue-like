import React from 'react';
import { extendObservable, observe, when, set, remove } from 'mobx';
import { observer } from 'mobx-react';
import {
  parseExpr, camelize, isFunction, iterativeParent, handleError, defComputed,
  findComponentEl
} from './utils';
import config from './config';
import propcheck from './prop-check';

function generateComputed(obj) {
  const ret = {};

  Object.keys(obj).forEach(key => {
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

@observer
class ReactVueLike extends React.Component {
  constructor(_props) {
    super(_props);

    const target = new.target;
    const { mixins, isRoot, inherits } = target;

    this._isVueLike = true;
    this._isVueLikeRoot = Boolean(isRoot);
    this._type = target;
    this._ticks = [];
    this._provides = [];
    this._injects = [];
    this._inherits = null;
    this.$refs = {};
    this.$parent = null;
    this.$root = null;
    this.$children = [];

    this._renderFn = this.render;
    this.render = ReactVueLike.prototype.render;

    const inheritsKeys = (inherits && Object.keys(inherits));
    if (inheritsKeys.length) {
      this._inherits = {};
      inheritsKeys.forEach(key => this._inherits[key] = inherits[key]);
    }

    const ctxs = mixins ? [...ReactVueLike.mixins, ...mixins, target] : [...ReactVueLike.mixins, target];
    this.$listeners = initListeners(ctxs, _props);

    this.$emit('hook:beforeCreate', _props);

    let _data = {};
    let _computed = {};
    let _methods = {};
    let _watch = {};
    ctxs.forEach(ctx => {
      if (ctx.data) Object.assign(_data, ctx.data.call(this, _props));
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) this._provides.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(key => !this._injects.includes(key) && this._injects.push(key));
    });

    this.$data = _data;
    let _deeps = {};
    let _shadows = {};
    Object.keys(_data).forEach(key => {
      if (key.startsWith('_')) _shadows[key] = _data[key];
      else _deeps[key] = _data[key];
    });
    extendObservable(this, _deeps, {}, { deep: true });
    extendObservable(this, _shadows, {}, { deep: false });

    extendObservable(this, generateComputed(_computed));

    bindMethods(this, _methods);
    const pMethods = {};
    Object.getOwnPropertyNames(target.prototype)
      .filter(key => ReactVueLike.prototype[key])
      .map(key => isFunction(this[key]) && (pMethods[key] = this[key]));
    bindMethods(this, pMethods);

    bindWatch(this, _watch);

    this.$emit('hook:created');
    this.$emit('hook:beforeMount');
  }

  _resolveParent() {
    if (!this._isVueLikeRoot) {
      iterativeParent(this, parent => this.$parent = parent, ReactVueLike);
      if (this.$parent) {
        this.$parent.$children.push(this);

        if (this.$parent._inherits) {
          if (!this._inherits) this._inherits = {};
          Object.assign(this._inherits, this.$parent._inherits);
        }
      }
    }
    this.$root = this.$parent ? this.$parent.$root : this;

    if (this._inherits) Object.assign(this, this._inherits);
  }

  _resolveInject() {
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

  _resolveEl() {
    this.$el = findComponentEl(this);
  }

  _resolveDestory() {
    if (this.$parent) {
      const idx = this.$parent.$children.findIndex(c => c === this);
      if (~idx) this.$parent.$children.splice(idx, 1);
    }
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

  static inherits = {

  }

  static props = {

  }

  static mixins = [];

  static data(props) {
    return {};
  }

  static provide() {

  }

  static inject = [];

  static computed = {

  }

  static watch = {

  }

  static methods = {

  }

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
    this.$listeners[eventName].push(handler.bind(this));
  }

  $off(eventName, handler) {
    eventName = camelize(eventName);
    if (handler) {
      const handlers = this.$listeners[eventName];
      if (handlers) {
        const idx = handlers.findIndex(v => v === handler);
        if (~idx) handlers.splice(idx, 1);
      }
      return;
    }
    delete this.$listeners[eventName];
  }

  $once(eventName, handler) {
    eventName = camelize(eventName);
    this.$listeners[eventName] = (...payload) => {
      this.$off(eventName, handler);
      return handler.call(this, ...payload);
    };
  }

  render(...args) {
    return this._renderFn && this._renderFn(...args);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.$emit('hook:beforeUpdate');
    return null;
  }

  componentDidMount() {
    if (this._reactInternalFiber) {
      this._resolveParent();
      this._resolveInject();
      this._resolveEl();
    }

    this.$emit('hook:mounted');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.$emit('hook:updated');

    if (this._ticks.length) {
      const ticks = this._ticks.slice();
      this._ticks = [];
      setTimeout(() => ticks.forEach(v => v()), 0);
    }
  }

  componentWillUnmount() {
    this.$emit('hook:beforeDestory');
    this._resolveDestory();
  }

  componentDidCatch(error, info) {
    this.$emit('hook:errorCaptured', error, this, info);
  }
}

ReactVueLike.config.optionMergeStrategies = {

};

ReactVueLike.Component = ReactVueLike;

function ReactHook() {
  const _createElement = React.createElement;
  React.createElement = function createElement(Component, ...args) {
    if (!Component || !Component.props) return _createElement.call(this, Component, ...args);
    // eslint-disable-next-line
    if (!Component.propTypes && (Component.prototype instanceof ReactVueLike)) {
      Component = propcheck(Component);
      if (Component.beforeConstructor) Component.beforeConstructor(Component);
    }
    return _createElement.call(this, Component, ...args);
  };
}

ReactHook();

export default ReactVueLike;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _mobx2 = require("./mobx");

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

var _class, _class2, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateComputed(obj, propData, data, target) {
  var _this = this;

  const ret = {};
  Object.keys(obj).forEach(function (key) {
    if (key in propData) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with props`);
      (0, _utils.handleError)(e, _this, `constructor:${target.name}`);
      throw e;
    }

    if (key in data) {
      let e = new Error(`key '${key}' in computed cannot be duplicated with data()`);
      (0, _utils.handleError)(e, _this, `constructor:${target.name}`);
      throw e;
    }

    const v = obj[key];
    if ((0, _utils.isFunction)(v)) return (0, _utils.defComputed)(ret, key, v);
    (0, _utils.defComputed)(ret, key, v.get, (0, _mobx2.action)(key, v.set));
  });
  return ret;
}

function bindMethods(ctx, methods) {
  methods && Object.keys(methods).forEach(function (key) {
    // let method = methods[key].bind(ctx);
    // ctx[key] = action(key, method);
    ctx[key] = methods[key].bind(ctx);
  });
}

function bindWatch(ctx, watch) {
  if (!watch) return;
  Object.keys(watch).forEach(function (key) {
    return ctx.$watch(key, watch[key]);
  });
}

const LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'errorCaptured'];
const RGEX_EVENT = /on([A-Z]\w+)/; // const RGEX_SYNC = /^(\w+)\$sync$/;

function initListeners(ctxs, props) {
  let listeners = {};

  const addListener = function addListener(key, handler) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push((0, _mobx2.action)(key, handler));
  };

  ctxs.forEach(function (ctx) {
    LIFECYCLE_HOOKS.forEach(function (key) {
      const name = (0, _utils.camelize)(`hook:${key}`);
      let handler = ctx[key];
      if (!handler && ctx.prototype && ctx.prototype[key]) handler = ctx.prototype[key];
      if (handler) addListener(name, handler);
    });
  });

  if (props) {
    Object.keys(props).forEach(function (key) {
      const handler = props[key];
      if (!handler) return;

      let _ref = key.match(RGEX_EVENT) || [],
          _ref2 = _slicedToArray(_ref, 2),
          eventName = _ref2[1];

      if (eventName) addListener((0, _utils.camelize)(eventName), handler);
    });
  }

  return listeners;
}

function parseProps(target, props, propTypes) {
  const propData = {};
  const attrs = {};
  if (!propTypes) propTypes = {};
  Object.keys(props).forEach(function (key) {
    if (propTypes[key]) propData[key] = props[key];
    if (['ref', 'children'].includes(key) || /^[$_]/.test(key)) return;

    if (target.inheritAttrs || target.inheritAttrs === undefined) {
      if (Array.isArray(target.inheritAttrs) && ~target.inheritAttrs.indexOf(key)) return;
      if (~_config.default.inheritAttrs.indexOf(key)) return;
    }

    attrs[key] = props[key];
  });
  return {
    propData,
    attrs
  };
}

let ReactVueLike = (0, _mobxReact.observer)(_class = (_temp = _class2 = class ReactVueLike extends _react.default.Component {
  constructor(_props) {
    var _this2;

    super(_props);
    _this2 = this;
    const target = new.target; // eslint-disable-next-line

    const propTypes = target.propTypes,
          mixins = target.mixins,
          isRoot = target.isRoot,
          isAbstract = target.isAbstract,
          inherits = target.inherits;
    if (isRoot) this._isVueLikeRoot = true;
    if (isAbstract) this._isVueLikeAbstract = true;
    this._renderFn = this.render;
    this.render = ReactVueLike.prototype.render;

    const _parseProps = parseProps(target, _props, propTypes),
          propData = _parseProps.propData,
          attrs = _parseProps.attrs;

    this._isVueLike = true;
    this._ticks = [];
    this._inherits = inherits ? _objectSpread({}, inherits) : null;
    this._el = null;
    this._mountedPending = [];
    this._isWillMount = false;
    this.$parent = null;
    this.$root = null;
    this.$children = [];
    this.$attrs = attrs;
    this.$slots = _props.$slots || {};
    this.$options = target;
    if (this.$slots.default === undefined) this.$slots.default = _props.children;
    (0, _mobx2.extendObservable)(this, {
      _isMounted: false
    });
    (0, _mobx2.extendObservable)(this, {
      $refs: {}
    }, {}, {
      deep: false
    });
    (0, _utils.defComputed)(this, '$el', function () {
      return _this2._el || (_this2._el = _reactDom.default.findDOMNode(_this2));
    }, function (v) {
      throw new Error('ReactVueLike error: $el is readonly!');
    });
    const ctxs = mixins ? [].concat(_toConsumableArray(ReactVueLike.mixins), _toConsumableArray(mixins), [target]) : [].concat(_toConsumableArray(ReactVueLike.mixins), [target]);
    let _datas = [];
    let _computed = {};
    let _methods = {};
    let _watch = {};
    let _directives = {};
    let _filters = {};
    let _provides = [];
    let _injects = [];
    ctxs.forEach(function (ctx) {
      if (ctx.filters) Object.assign(_filters, ctx.filters);
      if (ctx.directives) Object.assign(_directives, ctx.directives);
      if (ctx.data) _datas.push(ctx.data);
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) _provides.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(function (key) {
        return !_injects.includes(key) && _injects.push(key);
      });
    });
    (0, _mobx2.extendObservable)(this, propData);
    this.$listeners = initListeners(ctxs, _props);
    this.$filters = _filters;
    this.$directives = _directives;
    this._datas = _datas;
    this._propData = propData;
    this._methods = _methods;
    this._computed = _computed;
    this._watch = _watch;
    this._provides = _provides;
    this._injects = _injects;
    this._inheritMergeStrategies = Object.assign({}, _config.default.inheritMergeStrategies, this.$options.inheritMergeStrategies);
    (0, _mobx2.action)(function () {
      Object.keys(_this2._inheritMergeStrategies).forEach(function (key) {
        let merge = _this2._inheritMergeStrategies[key];
        let child = _this2._inherits[key];
        let parent = _this2[key];
        if (!parent) return;

        if (child) {
          let v = merge(parent, child, _this2, key);
          if (v !== undefined && v !== child) _this2._inherits[key] = v;
        } else _this2._inherits[key] = parent;
      });
    })();
    this._optionMergeStrategies = Object.assign({}, _config.default.optionMergeStrategies, this.$options.optionMergeStrategies);
    this.$emit('hook:beforeCreate', _props); // if (_props.el instanceof Element) this.$mount(_props.el);
  }

  _resolvePropRef() {
    const $ref = this.props.$ref;

    if (!this._isVueLikeAbstract && $ref) {
      if ((0, _utils.isObject)($ref)) $ref.current = this;else if ((0, _utils.isFunction)($ref)) $ref(this);
    }
  }

  _resolveRef(refName, el, key) {
    this.$refs[refName] = el; // if (!key) {
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
      ret = slot.map(function (s) {
        return (0, _utils.isFunction)(s) ? s(scope) : s;
      });
      if (!ret.length) ret = null;
    } else ret = (0, _utils.isFunction)(slot) ? slot(scope) : slot;

    return ret || children || null;
  }

  _resolveSpreadAttrs(tagName, props) {
    var _this3 = this;

    if (this.$options.inheritAttrs === false) return props;
    let inheritAttrs = Array.isArray(this.$options.inheritAttrs) ? this.$options.inheritAttrs : _config.default.inheritAttrs;
    const RETX_DOM = /^[a-z]/;
    let attrs = {};
    const isPrimitiveTag = RETX_DOM.test(tagName);
    inheritAttrs.forEach(function (key) {
      let v = _this3.props[key];
      if ((0, _utils.isFalsy)(v)) return;
      if (key !== 'style' && isPrimitiveTag && !(0, _utils.isPrimitive)(v)) v = '';
      if (v === true) v = '';
      attrs[key] = v;
    });

    if (attrs.className && props.className && attrs.className !== props.className) {
      let ac = attrs.className.split(' ');
      let pc = props.className.split(' ');
      pc.forEach(function (c) {
        if (!c) return;
        if (~ac.indexOf(c)) return;
        ac.push(c);
      });
      attrs.className = ac.join(' ');
      delete props.className;
    }

    if ((0, _utils.isObject)(attrs.style) && (0, _utils.isObject)(props.style) && attrs.style !== props.style) {
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
      (0, _utils.handleError)(e, this, `filter:${filterName}`);
      return '';
    }
  }

  _resolveWillMount(beforeMount, mounted) {
    var _this4 = this;

    let _pending = (0, _mobx2.action)(function () {
      if (!_this4._isVueLikeRoot && _this4.$parent) {
        Object.keys(_this4._optionMergeStrategies).forEach(function (key) {
          let ret = _this4._optionMergeStrategies[key](_this4.$parent[key], _this4[key], _this4, key);

          if (ret !== _this4[key]) _this4[key] = ret;
        });
      }

      _this4.$root = _this4.$parent ? _this4.$parent.$root : _this4;

      _this4._resolveInherits();

      _this4._resolveMethods();

      _this4._resolveData();

      _this4._resolveComputed();

      _this4._resolveInject();

      _this4._resolveWatch();

      _this4._resolvePropRef();

      _this4.$emit('hook:created');

      let pending = _this4._mountedPending;
      _this4._mountedPending = [];
      pending.forEach(function (v) {
        return v();
      });
      beforeMount && beforeMount();
      _this4._isMounted = true;
      mounted && _this4.$nextTick(mounted);
    });

    if (!this.$parent || this.$parent._isWillMount) _pending();else this.$parent._mountedPending.push(_pending);
  }

  _resolveInherits() {
    var _this5 = this;

    if (!this._isVueLikeRoot && this.$parent) {
      if (this.$parent._inherits) {
        if (!this._inherits) this._inherits = {};
        Object.assign(this._inherits, this.$parent._inherits);
      }
    }

    if (this._inherits) {
      (0, _mobx2.action)(function () {
        Object.keys(_this5._inherits).forEach(function (key) {
          let child = _this5[key];
          let parent = _this5._inherits[key];
          const merge = _this5._inheritMergeStrategies[key];
          let v = merge ? merge(parent, child, _this5, key) : parent;
          if (v !== undefined) _this5[key] = v;
        });
      })();
    }
  }

  _resolveEvent(handler) {
    if (!handler) return handler;
    return (0, _mobx2.action)(handler);
  }

  _resolveData() {
    var _this6 = this;

    const _data = {};

    this._datas.forEach(function (data) {
      Object.assign(_data, data.call(_this6, _this6.props));
    });

    this.$data = _data;
    let deeps = {};
    let shadows = {};
    Object.keys(_data).forEach(function (key) {
      if (key in _this6._propData) {
        let e = new Error(`key '${key}' in data() cannot be duplicated with props`);
        (0, _utils.handleError)(e, _this6, `constructor:${_this6.$options.name}`);
        throw e;
      }

      if (key.startsWith('_')) shadows[key] = _data[key];else deeps[key] = _data[key];
    });
    (0, _mobx2.extendObservable)(this, deeps, {}, {
      deep: true
    });
    (0, _mobx2.extendObservable)(this, shadows, {}, {
      deep: false
    });
  }

  _resolveComputed() {
    let _computed = generateComputed(this._computed, this._propData, this.$data, this.$options);

    (0, _mobx2.extendObservable)(this, _computed);
  }

  _resolveWatch() {
    bindWatch(this, this._watch);
  }

  _resolveMethods() {
    var _this7 = this;

    bindMethods(this, this._methods);
    const pMethods = {};
    Object.getOwnPropertyNames(this.$options.prototype).filter(function (key) {
      return !ReactVueLike.prototype[key];
    }).map(function (key) {
      return (0, _utils.isFunction)(_this7[key]) && (pMethods[key] = _this7[key]);
    });
    bindMethods(this, pMethods);
  }

  _resolveParent() {
    var _this8 = this;

    if (this._isVueLikeRoot) return;
    (0, _utils.iterativeParent)(this, function (parent) {
      return _this8.$parent = parent;
    }, ReactVueLike);
    if (this.$parent) this.$parent.$children.push(this);else if (this.props.$parent) this.$parent = this.props.$parent;
  }

  _resolveInject() {
    var _this9 = this;

    if (!this.$parent) return;

    try {
      const injects = this._injects;

      const getProvides = function getProvides(vm) {
        const provides = vm && vm._provides;
        if (!provides || !provides.length) return;
        let ret = {};
        provides.forEach(function (p) {
          return Object.assign(ret, (0, _utils.isFunction)(p) ? p.call(vm) : p);
        });
        return ret;
      };

      if (injects.length) {
        (0, _utils.iterativeParent)(this, function (vm) {
          let _provide = getProvides(vm);

          if (_provide) {
            for (let i = injects.length - 1; i; i--) {
              let key = injects[i];
              let v = _provide[key];

              if (v !== undefined) {
                _this9.$set(_this9, key, v);

                injects.splice(i, 1);
              }
            }
          }

          return !injects.length;
        }, ReactVueLike);
      }
    } catch (e) {
      (0, _utils.handleError)(e, this, 'resolveInject');
      throw e;
    }
  }

  _resolveComp(compName) {
    let comp;
    if (this.$options.components) comp = this.$options.components[compName];

    if (!this._isVueLikeRoot && !comp && this.$root.$options.components) {
      comp = this.$root.$options.components[compName];
    }

    if (!_utils.isProduction && !comp) (0, _utils.warn)(`can not resolve component '${compName}'!`, this);
    return comp || compName;
  }

  _resolveUpdated() {
    this._el = null;
  }

  _resolveDestory() {
    var _this10 = this;

    this._flushTicks();

    const $ref = this.props.$ref;

    if (!this._isVueLikeAbstract && $ref) {
      if ((0, _utils.isObject)($ref)) $ref.current = null;else if ((0, _utils.isFunction)($ref)) $ref(null);
    }

    if (this.$parent) {
      const idx = this.$parent.$children.findIndex(function (c) {
        return c === _this10;
      });
      if (~idx) this.$parent.$children.splice(idx, 1);
    }
  }

  _flushTicks() {
    if (!this._ticks.length) return;

    const ticks = this._ticks.slice();

    this._ticks = [];
    setTimeout(function () {
      return ticks.forEach(function (v) {
        return v();
      });
    }, 0);
  }

  _callListener(eventName, handlers, args) {
    try {
      if (!handlers) return;
      if ((0, _utils.isFunction)(handlers)) return handlers.call.apply(handlers, [this].concat(_toConsumableArray(args)));
      let ret;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let handler = _step.value;
          ret = handler.call.apply(handler, [this].concat(_toConsumableArray(args)));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return ret;
    } catch (e) {
      (0, _utils.handleError)(e, this, `$emit:${eventName}`);
      throw e;
    }
  }

  static use(plugin) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let install = (0, _utils.isFunction)(plugin) ? plugin : plugin.install ? plugin.install.bind(plugin) : null;
    if (!install) throw Error('ReactVueLike.use error: plugin need has \'install\' method!');

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return install.apply(void 0, [ReactVueLike, options].concat(args));
  }

  static config() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Object.assign(_config.default, options);
    if (_config.default.useAction !== undefined) (0, _mobx.configure)({
      enforceActions: _config.default.action ? 'observed' : 'never'
    });
  }

  static mixin(m) {
    if (!m) return;
    ReactVueLike.mixins.push(m);
  }

  static data(props) {
    return {};
  }

  static provide() {}

  beforeCreate() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  }

  created() {}

  beforeMount() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  }

  mounted() {}

  beforeUpdate() {}

  updated() {}

  beforeDestory() {}

  errorCaptured(err, vm, info) {}

  $mount(elementOrSelector) {
    if (!elementOrSelector) throw new Error('$mount error: elementOrSelector can not be null!');
    let el;
    let sc = false;
    if (typeof elementOrSelector === 'string') el = document.getElementById(elementOrSelector);else if (elementOrSelector instanceof Element) el = elementOrSelector;else {
      el = document.createElement('div');
      sc = true;
    } // throw new Error(`$mount error: elementOrSelector ${elementOrSelector} is not support type!`);

    let instance = this;

    const ReactVueLikeProxy = function ReactVueLikeProxy(props) {
      return instance;
    };

    ReactVueLikeProxy.prototype = _react.default.Component.prototype;
    ReactVueLikeProxy.dispalyName = this.$options.dispalyName || this.$options.name;

    _reactDom.default.render(_react.default.createElement(ReactVueLikeProxy, this.props), el);

    return sc ? el : instance;
  }

  $destroy() {
    _reactDom.default.unmountComponentAtNode(this.$el);
  }

  $forceUpdate() {
    return this.forceUpdate();
  }

  $runAction() {
    return _mobx2.runInAction.apply(void 0, arguments);
  }

  $nextTick(cb, ctx) {
    if (ctx) cb = cb.bind(ctx);

    this._ticks.push((0, _mobx2.action)(cb));
  }

  $watch(expOrFn, callback) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!expOrFn || !callback) return;
    callback = (0, _mobx2.action)(callback.bind(this));

    if (typeof expOrFn === 'string') {
      let _parseExpr = (0, _utils.parseExpr)(this, expOrFn),
          obj = _parseExpr.obj,
          key = _parseExpr.key;

      if (obj && key) {
        return (0, _mobx2.observe)(obj, key, function (change) {
          return callback(change.newValue, change.oldValue);
        }, options.immediate);
      }
    } else if ((0, _utils.isFunction)(expOrFn)) {
      let oldValue;
      return (0, _mobx2.when)(function () {
        return oldValue !== expOrFn();
      }, callback);
    }
  }

  $computed(target, expr, value) {
    let force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    let _parseExpr2 = (0, _utils.parseExpr)(target, expr),
        obj = _parseExpr2.obj,
        key = _parseExpr2.key;

    if (obj && key) {
      if (!force && obj[key]) {
        let e = new Error(`key '${expr}' has aleady exist!`);
        (0, _utils.handleError)(e, this, `$computed:${expr}`);
        throw e;
      }

      let computedObj = {};
      if ((0, _utils.isFunction)(value)) (0, _utils.defComputed)(computedObj, key, value);else (0, _utils.defComputed)(computedObj, key, value.get, value.set);
      (0, _mobx2.extendObservable)(obj, computedObj);
    }
  }

  $set(target, expr, value) {
    if ((0, _utils.isObject)(expr)) return (0, _mobx2.set)(target, expr);

    let _parseExpr3 = (0, _utils.parseExpr)(target, expr),
        obj = _parseExpr3.obj,
        key = _parseExpr3.key;

    if (obj && key) (0, _mobx2.set)(obj, key, value);
  }

  $delete(target, expr) {
    var _this11 = this;

    if ((0, _utils.isObject)(expr)) {
      return Object.keys(expr).forEach(function (key) {
        return _this11.$delete(target, expr[key]);
      });
    }

    let _parseExpr4 = (0, _utils.parseExpr)(target, expr),
        obj = _parseExpr4.obj,
        key = _parseExpr4.key;

    if (obj && key) (0, _mobx2.remove)(obj, key);
  }

  $emit(eventName) {
    eventName = (0, _utils.camelize)(eventName);

    for (var _len2 = arguments.length, payload = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      payload[_key2 - 1] = arguments[_key2];
    }

    return this._callListener(eventName, this.$listeners[eventName], payload);
  }

  $on(eventName, handler) {
    var _this12 = this;

    eventName = (0, _utils.camelize)(eventName);
    if (!this.$listeners[eventName]) this.$listeners[eventName] = [];
    this.$listeners[eventName].push(handler);
    return function () {
      return _this12.$off(eventName, handler);
    };
  }

  $off(eventName, handler) {
    eventName = (0, _utils.camelize)(eventName);

    if (handler) {
      const handlers = this.$listeners[eventName];

      if (handlers) {
        const idx = handlers.findIndex(function (v) {
          return v === handler || v === handler._source;
        });
        if (~idx) handlers.splice(idx, 1);
      }

      if (handlers.length) return;
    }

    delete this.$listeners[eventName];
  }

  $once(eventName, handler) {
    const off = this.$on(eventName, function () {
      off();

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return handler.call.apply(handler, [this].concat(args));
    });
  }

  render() {
    if (!this._isMounted) return null;
    let node;

    try {
      node = this._renderFn && this._renderFn.apply(this, arguments);
    } catch (ex) {
      (0, _utils.handleError)(ex, this, 'render');

      try {
        node = this.renderError(ex);
      } catch (ex) {
        (0, _utils.handleError)(ex, this, 'renderError');
        throw ex;
      }
    } // let el = this.$el;
    // if (el) {
    //   let inheritAttrs = Array.isArray(this.$options.inheritAttrs)
    //     ? this.$options.inheritAttrs
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
    // console.log('ReactVueLike.render', this.$options.name, node);


    return node;
  }

  renderError() {
    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.$emit('hook:beforeUpdate');
    return null;
  }

  componentDidMount() {
    var _this13 = this;

    this._resolveParent();

    this._isWillMount = true;

    this._resolveWillMount(function () {
      return _this13.$emit('hook:beforeMount');
    }, function () {
      return _this13.$emit('hook:mounted');
    });
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

}, _defineProperty(_class2, "isRoot", false), _defineProperty(_class2, "isAbstract", false), _defineProperty(_class2, "inheritAttrs", true), _defineProperty(_class2, "inheritMergeStrategies", {}), _defineProperty(_class2, "inherits", {}), _defineProperty(_class2, "props", {}), _defineProperty(_class2, "components", {}), _defineProperty(_class2, "mixins", []), _defineProperty(_class2, "directives", {}), _defineProperty(_class2, "filters", {}), _defineProperty(_class2, "inject", []), _defineProperty(_class2, "computed", {}), _defineProperty(_class2, "watch", {}), _defineProperty(_class2, "methods", {}), _temp)) || _class;

ReactVueLike.config.optionMergeStrategies = _config.default.optionMergeStrategies;
ReactVueLike.config.inheritMergeStrategies = _config.default.inheritMergeStrategies;
ReactVueLike.runAction = _mobx2.runInAction;
var _default = ReactVueLike;
exports.default = _default;
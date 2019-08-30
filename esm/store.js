"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.symbol");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.object.assign");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

var _mobx = require("mobx");

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function wrapModuleState(module) {
  var ret = {};
  if (!module._state) return ret;
  Object.keys(module._state).forEach(function (key) {
    return (0, _utils.defComputed)(ret, key, function () {
      return module._state[key];
    }, function (v) {
      if (module.strict && !module._commiting) {
        throw new Error("ReactVueLike.Store error: ''".concat(key, "' state can only be modified in mutation!"));
      }

      module._state[key] = v;
    });
  });
  return ret;
}

var Store =
/*#__PURE__*/
function () {
  function Store() {
    var _this = this;

    var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parent = arguments.length > 1 ? arguments[1] : undefined;
    var root = arguments.length > 2 ? arguments[2] : undefined;
    var moduleName = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, Store);

    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.actionListeners = [];
    this.moduleName = moduleName || '';
    this.namespaced = module.namespaced || false;
    this.strict = Boolean(module.strict);
    this._commiting = false;
    this._state = module.state || {};
    this.state = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this.modules = {};
    this.plugins = module.plugins || [];
    var _getters = {};

    if (module.getters) {
      Object.keys(module.getters).forEach(function (key) {
        return (0, _utils.defComputed)(_getters, key, function () {
          var get = module.getters[key];
          return get(_this.state, _this.getters, _this.root.state, _this.root.getters);
        });
      });
    }

    this.state = _mobx.observable.object(wrapModuleState(this));
    this.getters = _mobx.observable.object(_getters);
    this.mutations = module.mutations ? _objectSpread({}, module.mutations) : {};
    this.actions = module.actions ? _objectSpread({}, module.actions) : {};

    if (this.parent && moduleName) {
      this._mergeState(this.moduleName, this.state);

      this._mergeGetters(this.moduleName, _getters);

      this._mergeMutations(this.moduleName, this.mutations);

      this._mergeActions(this.moduleName, this.actions);
    }

    if (module.modules) {
      Object.keys(module.modules).forEach(function (moduleName) {
        return _this.registerModule(moduleName, module.modules[moduleName]);
      });
    }

    if (module.install) this.install = module.install.bind(this);
    if (this.plugins) this.plugins.forEach(function (p) {
      return p(_this);
    });
  }

  _createClass(Store, [{
    key: "_getModuleKey",
    value: function _getModuleKey(moduleName, key) {
      return this.namespaced ? "".concat(moduleName, "/").concat(key) : key;
    }
  }, {
    key: "_mergeState",
    value: function _mergeState(moduleName, state) {
      (0, _mobx.set)(this.state, moduleName, state);
    }
  }, {
    key: "_mergeGetters",
    value: function _mergeGetters(moduleName, getters) {
      var _this2 = this;

      var newGetters = {};
      var keys = Object.keys(getters);
      if (!keys.length) return;
      keys.forEach(function (key) {
        var d = Object.getOwnPropertyDescriptor(getters, key);
        if (!d) return;
        (0, _utils.defComputed)(newGetters, _this2._getModuleKey(moduleName, key), d.get, d.set);
      });
      (0, _mobx.extendObservable)(this.getters, newGetters);
      if (this.parent) this.parent._mergeGetters(this.moduleName, getters);
    }
  }, {
    key: "_mergeMutations",
    value: function _mergeMutations(moduleName, mutations) {
      var _this3 = this;

      var newMutations = {};
      var keys = Object.keys(newMutations);
      if (!keys.length) return;
      keys.forEach(function (key) {
        return newMutations[_this3._getModuleKey(moduleName, key)] = mutations[key];
      });
      Object.assign(this.mutations, newMutations);
      if (this.parent) this.parent._mergeMutations(this.moduleName, mutations);
    }
  }, {
    key: "_mergeActions",
    value: function _mergeActions(moduleName, actions) {
      var _this4 = this;

      var newAtions = {};
      var keys = Object.keys(newAtions);
      if (!keys.length) return;
      keys.forEach(function (key) {
        return newAtions[_this4._getModuleKey(moduleName, key)] = actions[key];
      });
      Object.assign(this.mutations, newAtions);
      if (this.parent) this.parent._mergeMutations(this.moduleName, actions);
    }
  }, {
    key: "_removeState",
    value: function _removeState(key) {
      (0, _mobx.remove)(this.state, key);
    }
  }, {
    key: "_removeGetter",
    value: function _removeGetter(key) {
      (0, _mobx.remove)(this.getters, key);
      if (this.parent) this.parent._removeGetter(this.parent._getModuleKey(this.moduleName, key));
    }
  }, {
    key: "_removeMutation",
    value: function _removeMutation(key) {
      delete this.mutations[key];
      if (this.parent) this.parent._removeMutation(this.parent._getModuleKey(this.moduleName, key));
    }
  }, {
    key: "_removeAction",
    value: function _removeAction(key) {
      delete this.actions[key];
      if (this.parent) this.parent._removeAction(this.parent._getModuleKey(this.moduleName, key));
    }
  }, {
    key: "replaceState",
    value: function replaceState() {
      var _this5 = this;

      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _state = _objectSpread({}, state);

      Object.keys(this.modules).forEach(function (moduleName) {
        return _state[moduleName] = _this5.modules[moduleName].state || {};
      });
      this._state = _state;
      this.state = _mobx.observable.object(wrapModuleState(this));
    }
  }, {
    key: "registerModule",
    value: function registerModule(moduleName, module) {
      if (!moduleName) return;
      if (this.modules[moduleName]) this.unregisterModule(moduleName);
      if (!module) return;
      this.modules[moduleName] = new Store(module, this, this.root, moduleName);
    }
  }, {
    key: "unregisterModule",
    value: function unregisterModule(moduleName) {
      var _this6 = this;

      var module = this.modules[moduleName];
      if (!module) return;

      this._removeState(moduleName);

      Object.keys(this.getters).forEach(function (key) {
        if (key === _this6._getModuleKey(moduleName, key)) _this6._removeGetter(key);
      });
      Object.keys(this.mutations).forEach(function (key) {
        if (key === _this6._getModuleKey(moduleName, key)) _this6._removeMutation(key);
      });
      Object.keys(this.actions).forEach(function (key) {
        if (key === _this6._getModuleKey(moduleName, key)) _this6._removeAction(key);
      });
      this.modules[moduleName] = null;
    }
  }, {
    key: "watch",
    value: function watch(fn, callback) {
      var oldValue;
      return (0, _mobx.when)(function () {
        return oldValue !== fn();
      }, callback);
    }
  }, {
    key: "commit",
    value: function commit(event, payload) {
      var _this7 = this;

      if (!event) return;

      var _event$split$ = _slicedToArray(event.split('/')[0], 2),
          moduleName = _event$split$[0],
          eventName = _event$split$[1];

      var ret;

      if (eventName) {
        var module = this.modules[moduleName];
        if (!module) throw new Error("commit error: module '".concat(moduleName, "' not be found!"));
        ret = module.commit(eventName, payload);
      } else {
        var mutation = this.mutations[event];
        if (!mutation) throw new Error("commit error: event '".concat(event, "' not be found!"));
        this._commiting = true;

        try {
          ret = mutation.call(this, this.state, payload, this.parent, this.root);
        } finally {
          this._commiting = false;
        }
      }

      this.mutationListeners.forEach(function (v) {
        return v({
          type: 'UPDATE_DATA',
          payload: payload
        }, _this7.state);
      });
      return ret;
    }
  }, {
    key: "dispatch",
    value: function dispatch(event, payload) {
      var _this8 = this;

      if (!event) return;

      var _event$split$2 = _slicedToArray(event.split('/')[0], 2),
          moduleName = _event$split$2[0],
          eventName = _event$split$2[1];

      var ret;

      if (eventName) {
        var module = this.modules[moduleName];
        if (!module) throw new Error("commit error: module '".concat(moduleName, "' not be found!"));
        ret = module.dispatch(eventName, payload);
      } else {
        var action = this.actions[event];
        if (!action) throw new Error("commit error: event '".concat(event, "' not be found!"));
        var state = this.state,
            getters = this.getters,
            commit = this.commit;
        ret = action.call(this, {
          state: state,
          getters: getters,
          commit: commit
        });
      }

      this.actionListeners.forEach(function (v) {
        return v({
          type: 'UPDATE_DATA',
          payload: payload
        }, _this8.state);
      });
      return ret;
    }
  }, {
    key: "subscribe",
    value: function subscribe(handler) {
      var _this9 = this;

      if (!handler || this.mutationListeners.includes(handler)) return;
      this.mutationListeners.push(handler);
      return function () {
        var idx = _this9.mutationListeners.indexOf(handler);

        if (~idx) _this9.mutationListeners.splice(idx, 1);
      };
    }
  }, {
    key: "subscribeAction",
    value: function subscribeAction(handler) {
      var _this10 = this;

      if (!handler || this.actionListeners.includes(handler)) return;
      this.actionListeners.push(handler);
      return function () {
        var idx = _this10.actionListeners.indexOf(handler);

        if (~idx) _this10.actionListeners.splice(idx, 1);
      };
    }
  }]);

  return Store;
}();

var _default = Store;
exports.default = _default;
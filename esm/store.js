"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mobx = require("./mobx");

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function wrapModuleState(module) {
  let ret = {};
  if (!module._state) return ret;
  Object.keys(module._state).forEach(function (key) {
    let set = function set(v) {
      if (module.strict && !module._commiting) {
        throw new Error(`ReactVueLike.Store error: ''${key}' state can only be modified in mutation!`);
      }

      module._state[key] = v;
    };

    if (_config.default.enforceActions) set = (0, _mobx.action)(set);
    (0, _utils.defComputed)(ret, key, function () {
      return module._state[key];
    }, set);
  });
  return ret;
}

class Store {
  constructor() {
    var _this = this;

    let module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let parent = arguments.length > 1 ? arguments[1] : undefined;
    let root = arguments.length > 2 ? arguments[2] : undefined;
    let moduleName = arguments.length > 3 ? arguments[3] : undefined;
    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.actionListeners = [];
    this.moduleName = moduleName || '';
    this.namespaced = module.namespaced || false;
    this.strict = Boolean(module.strict);
    this._commiting = false;
    this._state = _mobx.observable.object(module.state || {});
    this.state = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this.modules = {};
    this.plugins = module.plugins || [];
    const _getters = {};

    if (module.getters) {
      Object.keys(module.getters).forEach(function (key) {
        return (0, _utils.defComputed)(_getters, key, function () {
          let get = module.getters[key];
          return get(_this.state, _this.getters, _this.root.state, _this.root.getters);
        });
      });
    }

    this.state = _mobx.observable.object(wrapModuleState(this));
    this.getters = _mobx.observable.object(_getters);

    let _mutations = module.mutations || {};

    this.mutations = {};
    Object.keys(_mutations).forEach(function (key) {
      return _this.mutations[key] = (0, _mobx.action)(key, _mutations[key]);
    });
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

  _getModuleKey(moduleName, key) {
    return this.namespaced ? `${moduleName}/${key}` : key;
  }

  _mergeState(moduleName, state) {
    (0, _mobx.set)(this.state, moduleName, state);
  }

  _mergeGetters(moduleName, getters) {
    var _this2 = this;

    const newGetters = {};
    const keys = Object.keys(getters);
    if (!keys.length) return;
    keys.forEach(function (key) {
      const d = Object.getOwnPropertyDescriptor(getters, key);
      if (!d) return;
      (0, _utils.defComputed)(newGetters, _this2._getModuleKey(moduleName, key), d.get, d.set);
    });
    (0, _mobx.extendObservable)(this.getters, newGetters);
    if (this.parent) this.parent._mergeGetters(this.moduleName, getters);
  }

  _mergeMutations(moduleName, mutations) {
    var _this3 = this;

    const newMutations = {};
    const keys = Object.keys(newMutations);
    if (!keys.length) return;
    keys.forEach(function (key) {
      return newMutations[_this3._getModuleKey(moduleName, key)] = mutations[key];
    });
    Object.assign(this.mutations, newMutations);
    if (this.parent) this.parent._mergeMutations(this.moduleName, mutations);
  }

  _mergeActions(moduleName, actions) {
    var _this4 = this;

    const newAtions = {};
    const keys = Object.keys(newAtions);
    if (!keys.length) return;
    keys.forEach(function (key) {
      return newAtions[_this4._getModuleKey(moduleName, key)] = actions[key];
    });
    Object.assign(this.actions, newAtions);
    if (this.parent) this.parent._mergeActions(this.moduleName, actions);
  }

  _removeState(key) {
    (0, _mobx.remove)(this.state, key);
  }

  _removeGetter(key) {
    (0, _mobx.remove)(this.getters, key);
    if (this.parent) this.parent._removeGetter(this.parent._getModuleKey(this.moduleName, key));
  }

  _removeMutation(key) {
    delete this.mutations[key];
    if (this.parent) this.parent._removeMutation(this.parent._getModuleKey(this.moduleName, key));
  }

  _removeAction(key) {
    delete this.actions[key];
    if (this.parent) this.parent._removeAction(this.parent._getModuleKey(this.moduleName, key));
  }

  replaceState() {
    var _this5 = this;

    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const _state = _objectSpread({}, state);

    Object.keys(this.modules).forEach(function (moduleName) {
      return _state[moduleName] = _this5.modules[moduleName].state || {};
    });
    this._state = _mobx.observable.object(_state);
    this.state = _mobx.observable.object(wrapModuleState(this));
  }

  registerModule(moduleName, module) {
    if (!moduleName) return;
    if (this.modules[moduleName]) this.unregisterModule(moduleName);
    if (!module) return;
    this.modules[moduleName] = new Store(module, this, this.root, moduleName);
  }

  unregisterModule(moduleName) {
    var _this6 = this;

    const module = this.modules[moduleName];
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

  watch(fn, callback) {
    let oldValue;
    return (0, _mobx.when)(function () {
      return oldValue !== fn();
    }, callback);
  }

  commit(event, payload) {
    var _this7 = this;

    if (!event) return;
    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';

    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) throw new Error(`commit error: module '${moduleName}' not be found!`);
      ret = module.commit(eventName, payload);
    } else {
      const mutation = this.mutations[event];
      if (!mutation) throw new Error(`commit error: event '${event}' not be found!`);
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
        payload
      }, _this7.state);
    });
    return ret;
  }

  dispatch(event, payload) {
    var _this8 = this;

    if (!event) return;
    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';

    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) throw new Error(`commit error: module '${moduleName}' not be found!`);
      ret = module.dispatch(eventName, payload);
    } else {
      const action = this.actions[event];
      if (!action) throw new Error(`commit error: event '${event}' not be found!`);
      const state = this.state,
            getters = this.getters,
            commit = this.commit;
      ret = action.call(this, {
        state,
        getters,
        commit
      });
    }

    this.actionListeners.forEach(function (v) {
      return v({
        type: 'UPDATE_DATA',
        payload
      }, _this8.state);
    });
    return ret;
  }

  subscribe(handler) {
    var _this9 = this;

    if (!handler || this.mutationListeners.includes(handler)) return;
    this.mutationListeners.push(handler);
    return function () {
      const idx = _this9.mutationListeners.indexOf(handler);

      if (~idx) _this9.mutationListeners.splice(idx, 1);
    };
  }

  subscribeAction(handler) {
    var _this10 = this;

    if (!handler || this.actionListeners.includes(handler)) return;
    this.actionListeners.push(handler);
    return function () {
      const idx = _this10.actionListeners.indexOf(handler);

      if (~idx) _this10.actionListeners.splice(idx, 1);
    };
  }

  install(ReactVueLike, _ref) {
    let App = _ref.App;
    if (!App.inherits) App.inherits = {};
    App.inherits.$store = this;
  }

}

var _default = Store;
exports.default = _default;
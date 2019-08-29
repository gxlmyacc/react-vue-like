"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

var _mobx = require("mobx");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ReactVueLikeStore =
/*#__PURE__*/
function () {
  function ReactVueLikeStore() {
    var _this = this;

    var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parent = arguments.length > 1 ? arguments[1] : undefined;
    var root = arguments.length > 2 ? arguments[2] : undefined;
    var namespace = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, ReactVueLikeStore);

    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.namespace = namespace || '';
    this.namespaced = module.namespaced || false;
    var getters = {};
    var prefix = this.prefix;
    var state = module.state || {};
    var mutations = module.mutations || {};

    if (module.getters) {
      Object.keys(module.getters).forEach(function (key) {
        return (0, _utils.defComputed)(getters, key, function () {
          var get = module.getters[key];
          return get(_this.state, _this.getters, _this.root.state, _this.root.getters);
        });
      });
    }

    var modules = module.modules || {};
    Object.keys(mutations).forEach(function (key) {
      return mutations[key] = (0, _mobx.action)(mutations[key]);
    });
    Object.keys(modules).forEach(function (key) {
      modules[key] = new ReactVueLikeStore(modules[key], _this, _this.root, "".concat(prefix).concat(key));
    });
    this.state = _mobx.observable.object(state);
    this.getters = _mobx.observable.object(getters);
    this.mutations = mutations;
    this.modules = modules;

    if (this.root !== this) {
      var _state = {};
      Object.keys(this.state).forEach(function (key) {
        (0, _utils.defComputed)(_state, "".concat(prefix).concat(key), function () {
          return _this.state[key];
        }, function (v) {
          return _this.state[key] = v;
        });
      });
      (0, _mobx.set)(this.root.state, _state);
      var _getters = {};
      Object.keys(this.getters).forEach(function (key) {
        (0, _utils.defComputed)(_getters, "".concat(prefix).concat(key), function () {
          return _this.getters[key];
        });
      });
      (0, _mobx.set)(this.root.getters, _getters);
    }
  }

  _createClass(ReactVueLikeStore, [{
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
      var _this2 = this;

      if (!event) return;
      var mutation = this.mutations[event];
      if (!mutation) return;
      var ret = mutation.call(this, this.state, payload, this.parent, this.root);
      this.mutationListeners.forEach(function (v) {
        return v({
          type: 'UPDATE_DATA',
          payload: payload
        }, _this2.state);
      });
      return ret;
    }
  }, {
    key: "subscribe",
    value: function subscribe(handler) {
      var _this3 = this;

      if (!handler || this.mutationListeners.includes(handler)) return;
      this.mutationListeners.push(handler);
      return function () {
        var idx = _this3.mutationListeners.indexOf(handler);

        if (~idx) _this3.mutationListeners.splice(idx, 1);
      };
    }
  }, {
    key: "install",
    value: function install(ReactVueLike) {
      ReactVueLike.$store = ReactVueLike.prototype.$store = this;
    }
  }, {
    key: "prefix",
    get: function get() {
      return this.namespaced ? this.namespace ? this.namespace + '/' : '' : '';
    }
  }]);

  return ReactVueLikeStore;
}();

var _default = ReactVueLikeStore;
exports.default = _default;
//# sourceMappingURL=store.js.map
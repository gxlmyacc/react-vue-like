"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGenerator = isGenerator;
exports.isAsync = isAsync;
exports.flow = newFlow;
exports.action = newAction;
exports.configure = newConfigure;
exports.isAction = newIsActon;
Object.defineProperty(exports, "toJS", {
  enumerable: true,
  get: function get() {
    return _mobx.toJS;
  }
});
Object.defineProperty(exports, "isObservable", {
  enumerable: true,
  get: function get() {
    return _mobx.isObservable;
  }
});
Object.defineProperty(exports, "isObservableProp", {
  enumerable: true,
  get: function get() {
    return _mobx.isObservableProp;
  }
});
Object.defineProperty(exports, "isObservableObject", {
  enumerable: true,
  get: function get() {
    return _mobx.isObservableObject;
  }
});
Object.defineProperty(exports, "isObservableArray", {
  enumerable: true,
  get: function get() {
    return _mobx.isObservableArray;
  }
});
Object.defineProperty(exports, "isObservableMap", {
  enumerable: true,
  get: function get() {
    return _mobx.isObservableMap;
  }
});
Object.defineProperty(exports, "isBoxedObservable", {
  enumerable: true,
  get: function get() {
    return _mobx.isBoxedObservable;
  }
});
Object.defineProperty(exports, "isArrayLike", {
  enumerable: true,
  get: function get() {
    return _mobx.isArrayLike;
  }
});
Object.defineProperty(exports, "isComputed", {
  enumerable: true,
  get: function get() {
    return _mobx.isComputed;
  }
});
Object.defineProperty(exports, "isComputedProp", {
  enumerable: true,
  get: function get() {
    return _mobx.isComputedProp;
  }
});
Object.defineProperty(exports, "observable", {
  enumerable: true,
  get: function get() {
    return _mobx.observable;
  }
});
Object.defineProperty(exports, "extendObservable", {
  enumerable: true,
  get: function get() {
    return _mobx.extendObservable;
  }
});
Object.defineProperty(exports, "observe", {
  enumerable: true,
  get: function get() {
    return _mobx.observe;
  }
});
Object.defineProperty(exports, "decorate", {
  enumerable: true,
  get: function get() {
    return _mobx.decorate;
  }
});
Object.defineProperty(exports, "reaction", {
  enumerable: true,
  get: function get() {
    return _mobx.reaction;
  }
});
Object.defineProperty(exports, "intercept", {
  enumerable: true,
  get: function get() {
    return _mobx.intercept;
  }
});
Object.defineProperty(exports, "computed", {
  enumerable: true,
  get: function get() {
    return _mobx.computed;
  }
});
Object.defineProperty(exports, "autorun", {
  enumerable: true,
  get: function get() {
    return _mobx.autorun;
  }
});
Object.defineProperty(exports, "when", {
  enumerable: true,
  get: function get() {
    return _mobx.when;
  }
});
Object.defineProperty(exports, "runInAction", {
  enumerable: true,
  get: function get() {
    return _mobx.runInAction;
  }
});
Object.defineProperty(exports, "createAtom", {
  enumerable: true,
  get: function get() {
    return _mobx.createAtom;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _mobx.set;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _mobx.get;
  }
});
Object.defineProperty(exports, "remove", {
  enumerable: true,
  get: function get() {
    return _mobx.remove;
  }
});
Object.defineProperty(exports, "has", {
  enumerable: true,
  get: function get() {
    return _mobx.has;
  }
});
Object.defineProperty(exports, "onBecomeObserved", {
  enumerable: true,
  get: function get() {
    return _mobx.onBecomeObserved;
  }
});
Object.defineProperty(exports, "onBecomeUnobserved", {
  enumerable: true,
  get: function get() {
    return _mobx.onBecomeUnobserved;
  }
});

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.to-string");

var _mobx = require("mobx");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _toString = Object.prototype.toString;

function isGenerator(fn) {
  return fn && _toString.call(fn.prototype) === '[object Generator]';
}

function isAsync(fn) {
  return fn && _toString.call(fn) === '[object AsyncFunction]';
}

function newConfigure() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _config.default.useAction = options.enforceActions !== undefined && options.enforceActions !== 'never';
  return (0, _mobx.configure)(Object.assign({
    isolateGlobalState: true
  }, options));
}

if (_config.default.useAction) newConfigure({
  enforceActions: 'observed'
});

function newIsActon(fn) {
  return (0, _mobx.isAction)(fn) || fn.isMobxFlow;
}

function newFlow(target, name, descriptor) {
  var value;

  if (arguments.length === 1) {
    value = (0, _mobx.flow)(target);
    value._source = target;
  } else {
    value = (0, _mobx.flow)(descriptor.value);
    value._source = descriptor.value;
    descriptor.value = value;
  }

  value.isMobxFlow = true;
  return descriptor || value;
}

function newAction(target, name, descriptor) {
  var value;

  if (!descriptor || !descriptor.value) {
    var _fn = name || target;

    if (newIsActon(_fn)) value = _fn;else {
      value = isGenerator(_fn) ? (0, _mobx.flow)(_fn) : _mobx.action.apply(void 0, arguments);
      value._source = name || target;
    }
  } else if (!newIsActon(descriptor.value)) {
    value = isGenerator(descriptor.value) ? (0, _mobx.flow)(descriptor.value) : (0, _mobx.action)(name, descriptor.value);
    value._source = descriptor.value;
    descriptor.value = value;
  }

  return descriptor || value;
}
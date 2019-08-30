"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defComputed = defComputed;
exports.isFunction = isFunction;
exports.parseExpr = parseExpr;
exports.camelize = camelize;
exports.iterativeParent = iterativeParent;
exports.handleError = handleError;
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
Object.defineProperty(exports, "computed", {
  enumerable: true,
  get: function get() {
    return _mobx.computed;
  }
});
Object.defineProperty(exports, "action", {
  enumerable: true,
  get: function get() {
    return _mobx.action;
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
Object.defineProperty(exports, "observer", {
  enumerable: true,
  get: function get() {
    return _mobxReact.observer;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _mobxReact.Provider;
  }
});
Object.defineProperty(exports, "Observer", {
  enumerable: true,
  get: function get() {
    return _mobxReact.Observer;
  }
});

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

var _mobx = require("mobx");

var _config = _interopRequireDefault(require("./config"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// isArray support ObservableArray
var arrayType = _mobx.observable.array([11, 22]);

if (!Array.isArray(arrayType)) {
  var _isArray = Array.isArray;

  Array.isArray = function (v) {
    return _isArray(v) || v instanceof Array;
  };
}

function defComputed(obj, key, get, set) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: get,
    set: set || function (v) {
      throw new Error("computed props: ".concat(key, " is readonly!"));
    }
  });
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function parseExpr(ctx, expr) {
  if (!expr) return {};
  var exps = expr.split('.');
  var parent = ctx;
  var obj;
  var key;
  exps.some(function (exp, i) {
    if (i === exps.length - 1) {
      obj = parent;
      key = exp;
      return true;
    }

    var v = parent[exp];
    if (v === undefined) return true;
    parent = v;
  });
  return {
    obj: obj,
    key: key
  };
}

function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
}

function iterativeParent(ctx, callback, componentClass) {
  if (ctx._isVueLikeRoot) return;
  var parentNode = ctx._reactInternalFiber && ctx._reactInternalFiber.return;

  while (parentNode) {
    var vm = parentNode.nodeType === undefined && parentNode.stateNode;

    if (vm && (!componentClass || vm instanceof componentClass)) {
      if (callback(vm)) break;
    }

    if (vm && vm._isVueLikeRoot) break;
    parentNode = parentNode.return;
  }
} // export function findComponentEl(vm) {
//   let node = vm && vm._reactInternalFiber;
//   while (node) {
//     let el = node.stateNode;
//     if (el instanceof Element) return el;
//     let child = node.child;
//     if (!child) break;
//     node = child.stateNode ? child : child._reactInternalFiber;
//   }
//   return null;
// }


function warn(msg, vm) {
  var trace = vm ? generateComponentTrace(vm) : '';

  if (_config.default.warnHandler) {
    _config.default.warnHandler.call(null, msg, vm, trace);
  } else if (!_config.default.silent) {
    console.error('[ReactVueLike warn]: ' + msg + trace);
  }
}

function logError(err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn('Error in ' + info + ': "' + err.toString() + '"', vm);
  }

  if (typeof global.console !== 'undefined') {
    console.error(err);
  } // else throw err;

}

function globalHandleError(err, vm, info) {
  if (_config.default.errorHandler) {
    try {
      return _config.default.errorHandler.call(null, err, vm, info);
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }

  logError(err, vm, info);
}

function handleError(err, vm, info) {
  if (vm) {
    var cur = vm;

    do {
      var hooks = cur.$listeners['hook:errorCaptured'];

      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;

            if (capture) {
              return;
            }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    } while (cur = cur.$parent);
  }

  globalHandleError(err, vm, info);
}

var classifyRE = /(?:^|[-_])(\w)/g;

function classify(str) {
  return str.replace(classifyRE, function (c) {
    return c.toUpperCase();
  }).replace(/[-_]/g, '');
}

function formatComponentName(vm, includeFile) {
  if (vm.$root === vm) return '<Root>';
  var name = getComponentName(vm);
  return name ? '<' + classify(name) + '>' : '<Anonymous>';
}

function repeat(str, n) {
  var res = '';

  while (n) {
    if (n % 2 === 1) {
      res += str;
    }

    if (n > 1) {
      str += str;
    }

    n >>= 1;
  }

  return res;
}

function generateComponentTrace(vm) {
  if (vm._isVue && vm.$parent) {
    var tree = [];
    var currentRecursiveSequence = 0;

    while (vm) {
      if (tree.length > 0) {
        var last = tree[tree.length - 1];

        if (last.constructor === vm.constructor) {
          currentRecursiveSequence++;
          vm = vm.$parent;
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }

      tree.push(vm);
      vm = vm.$parent;
    }

    return '\n\nfound in\n\n' + tree.map(function (vm, i) {
      return '' + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + '... (' + vm[1] + ' recursive calls)' : formatComponentName(vm));
    }).join('\n');
  }

  return '\n\n(found in ' + formatComponentName(vm) + ')';
}

function getComponentName(vm) {
  var type = vm && vm._type;
  return type ? type.displayName || type.name : '<Anonymous>';
}
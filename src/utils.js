import { observable } from 'mobx';
import config from './config';

export {
  observable, extendObservable, observe,
  computed, action, autorun, when, runInAction,
  set, get, remove, has
} from 'mobx';
export { observer, Provider, Observer } from 'mobx-react';

// isArray support ObservableArray
const arrayType = observable.array([11, 22]);
if (!Array.isArray(arrayType)) {
  const _isArray = Array.isArray;
  Array.isArray = function (v) {
    return _isArray(v) || (v instanceof Array);
  };
}

export function defComputed(obj, key, get, set) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get,
    set: set || function (v) { throw new Error(`computed props: ${key} is readonly!`); }
  });
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export function parseExpr(ctx, expr) {
  if (!expr) return {};
  const exps = expr.split('.');
  let parent = ctx;
  let obj; let key;
  exps.some((exp, i) => {
    if (i === exps.length - 1) {
      obj = parent;
      key = exp;
      return true;
    }

    let v = parent[exp];
    if (v === undefined) return true;

    parent = v;
  });
  return { obj, key };
}

export function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
}

export function iterativeParent(ctx, callback, componentClass) {
  if (ctx._isVueLikeRoot) return;
  let parentNode = ctx._reactInternalFiber
    ? ctx._reactInternalFiber.return
    : ctx.stateNode ? ctx : null;
  while (parentNode) {
    const vm = parentNode.nodeType === undefined && parentNode.stateNode;
    if (vm && !vm._isVueLikeAbstract && (!componentClass || vm instanceof componentClass)) {
      if (callback(vm)) break;
    }
    if (vm && vm._isVueLikeRoot) break;
    parentNode = parentNode.return;
  }
}

// export function findComponentEl(vm) {
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
  let trace = vm ? generateComponentTrace(vm) : '';

  if (config.warnHandler) {
    config.warnHandler.call(null, msg, vm, trace);
  } else if (!config.silent) {
    console.error(('[ReactVueLike warn]: ' + msg + trace));
  }
}

function logError(err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(('Error in ' + info + ': "' + (err.toString()) + '"'), vm);
  }
  if (typeof global.console !== 'undefined') {
    console.error(err);
  } // else throw err;
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
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

export function handleError(err, vm, info) {
  if (vm) {
    let cur = vm;
    do {
      let hooks = cur.$listeners['hook:errorCaptured'];
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            let capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return; }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    } while (cur = cur.$parent);
  }
  globalHandleError(err, vm, info);
}

let classifyRE = /(?:^|[-_])(\w)/g;
function classify(str) {
  return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, '');
}

function formatComponentName(vm, includeFile) {
  if (vm.$root === vm) return '<Root>';
  let name = getComponentName(vm);
  return name ? ('<' + (classify(name)) + '>') : '<Anonymous>';
}

function repeat(str, n) {
  let res = '';
  while (n) {
    if (n % 2 === 1) { res += str; }
    if (n > 1) { str += str; }
    n >>= 1;
  }
  return res;
}

function generateComponentTrace(vm) {
  if (vm._isVue && vm.$parent) {
    let tree = [];
    let currentRecursiveSequence = 0;
    while (vm) {
      if (tree.length > 0) {
        let last = tree[tree.length - 1];
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
    return '\n\nfound in\n\n' + tree
      .map(function (vm, i) {
        return ('' + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
          ? ((formatComponentName(vm[0])) + '... (' + (vm[1]) + ' recursive calls)')
          : formatComponentName(vm)));
      })
      .join('\n');
  }
  return ('\n\n(found in ' + (formatComponentName(vm)) + ')');
}

function getComponentName(vm) {
  const type = vm && vm._type;
  return type ? (type.displayName || type.name) : '<Anonymous>';
}

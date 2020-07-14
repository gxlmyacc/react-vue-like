import React from 'react';
import { observable } from './mobx';
import config from './config';

export {
  toJS, isObservableObject, flow,
  observable, extendObservable, observe,
  computed, action, autorun, when, runInAction,
  set, get, remove, has,
  isGenerator
} from './mobx';

export const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export const isProduction = process.env.NODE_ENV === 'production';
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;

export { observer, Provider, Observer, useLocalStore, useObserver } from 'mobx-react';

// isArray support ObservableArray
const arrayType = observable.array([11, 22]);
if (!Array.isArray(arrayType)) {
  const _isArray = Array.isArray;
  Array.isArray = function (v) {
    return _isArray(v) || (v instanceof Array);
  };
}

export function defComputed(obj, key, get, set, options) {
  Object.defineProperty(obj, key, Object.assign({
    enumerable: true,
    configurable: true,
    get,
    set: set || function (v) { throw new Error(`props: ${key} is readonly!`); }
  }, options));
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
  let ret = str.replace(/[-|:](\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
  if (/^[A-Z]/.test(ret)) ret = ret.charAt(0).toLowerCase() + ret.substr(1);
  return ret;
}

export function iterativeParent(ctx, callback, componentClassFn, fromSelf) {
  if (ctx._isVuelikeRoot) return;
  let parentNode = fromSelf
    ? ctx.stateNode ? ctx : ctx
    : ctx._reactInternalFiber
      ? ctx._reactInternalFiber.return
      : ctx.stateNode ? ctx : null;
  while (parentNode) {
    const vm = parentNode.nodeType === undefined && parentNode.stateNode;
    if (vm && (!componentClassFn || componentClassFn(vm))) {
      if (callback(vm)) break;
    }
    if (vm && vm._isVuelikeRoot) break;
    parentNode = parentNode.return;
  }
}

export function findComponentEl(vm) {
  if (!vm) return null;
  let node = vm._owner || vm._reactInternalFiber;
  while (node) {
    let el = node.stateNode;
    if (el instanceof Element) return el;
    let child = node.child;
    if (!child) break;
    node = child.stateNode ? child : child._reactInternalFiber;
  }
  return null;
}

export function isPrimitive(value) {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'symbol'
    || typeof value === 'boolean'
  );
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

const _toString = Object.prototype.toString;
const _hasOwnProperty = Object.prototype.hasOwnProperty;

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

export function hasOwnProperty(obj, prop) {
  return obj && _hasOwnProperty.call(obj, prop);
}

export function hasOwnPropertyValue(obj, prop, value) {
  return hasOwnProperty(obj, prop) && obj[prop] === value;
}

export function isFalsy(value) {
  return value === undefined
    || Number.isNaN(value)
    || value === null
    || value === false;
}

export function warn(msg, vm) {
  let trace = vm ? generateComponentTrace(vm) : '';

  if (config.warnHandler) {
    config.warnHandler.call(null, msg, vm, trace);
  } else if (!config.silent) {
    console.error(('[Vuelike warn]: ' + msg + trace));
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
      let hooks = cur.$listeners.componentDidCatch;
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            let capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return; }
          } catch (e) {
            globalHandleError(e, cur, 'componentDidCatch');
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
  if (vm.isVuelikeComponentInstance && vm.$parent) {
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
  const type = vm && vm.$options;
  return type ? (type.displayName || type.name) : '<Anonymous>';
}

export function checkKeyCodes(
  eventKeyCode,
  key,
  scope,
  eventKey
) {
  let keyCodes = config.keyCodes[key];
  if (!keyCodes) return true;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1;
  }
  if (isFunction(keyCodes)) return keyCodes(eventKeyCode, key, scope, eventKey);
  return keyCodes !== eventKeyCode;
}

export function innumerable(
  obj,
  key,
  value,
  options = { configurable: true, writable: true }
) {
  return Object.defineProperty(obj, key, { value, ...options });
}

const ClassPropertyNames = ['constructor', 'length", "prototype", "name'];

export {
  ClassPropertyNames
};

export function mergeMethods(target, source, excludes = []) {
  if (source.prototype && target instanceof source) return;
  const sm = Object.getOwnPropertyNames(source);
  const tm = Object.getOwnPropertyNames(target);
  sm.forEach(key => {
    if (ClassPropertyNames.includes(key) || excludes.includes(key)) return;
    let sfn = source[key];
    if (!isFunction(sfn)) return;
    let tfn = tm.includes(key) ? target[key] : null;
    if (tfn) {
      target[key] = function () {
        let sr = sfn.apply(this, arguments);
        let tr = tfn.apply(this, arguments.concat(sr));
        return tr === undefined ? sr : tr;
      };
    } else innumerable(target, key, sfn);
  });
}

export function replaceMethods(target, source, includes, prefix = '') {
  let ret = {};
  const sm = includes || Object.getOwnPropertyNames(source);
  const tm = Object.getOwnPropertyNames(target);
  sm.forEach(key => {
    if (ClassPropertyNames.includes(key)) return;
    let sfn = source[key];
    if (!isFunction(sfn)) return;
    let tfn = tm.includes(key) ? target[key] : null;
    if (!tfn && prefix && tm.includes(prefix + key)) tfn =  target[prefix + key]; 
    if (tfn) {
      target[key] = sfn;
      ret[key] = tfn;
    } else innumerable(target, key, sfn);
  });
  return ret;
}


export function mergeObject(target) {
  function _mergeObject(target, source, copiedObjects) {
    if (!target) return target;
    if (!isPlainObject(source)) return target;
    copiedObjects.push({ source, target });
    Object.keys(source).forEach(key => {
      let v = source[key];
      if (isPlainObject(v)) {
        let copied = copiedObjects.find(c => c.target === v);
        if (copied) target[key] = copied.target;
        else {
          let w = target[key];
          if (!isPlainObject(w)) w = target[key] = {};
          _mergeObject(w, v, copiedObjects);
        }
      } else target[key] = v;
    });
    return target;
  }

  let ret = target;
  let copiedObjects = [];
  for (let i = 1; i < arguments.length; i++) _mergeObject(ret, arguments[i], copiedObjects);
  return ret;
}
export const VUELIKE_PREFIX = '__vuelike';
export const VUELIKE_COMPONENT_CLASS = `${VUELIKE_PREFIX}ComponentClass`;
export const VUELIKE_CLASS = `${VUELIKE_PREFIX}Class`;

export function isVuelikeComponent(source) {
  return source && source[VUELIKE_PREFIX] && !hasOwnProperty(source, VUELIKE_COMPONENT_CLASS);
}

export function isVuelikeComponentClass(source) {
  return source && source[VUELIKE_COMPONENT_CLASS];
}

export function directivesMergeStrategies(parent, child, vm, key) {
  let ret = {};
  if (parent) return Object.assign(ret, parent);
  if (child) return Object.assign(ret, child);
  return ret;
}

export function defaultMergeStrategies(parent, child, vm, key) {
  return child || parent;
}

export function filtersMergeStrategies(parent, child, vm, key) {
  let ret = {};
  if (parent) return mergeObject(ret, parent);
  if (child) return mergeObject(ret, child);
  return ret;
}

export function isFunctionComponent(component) {
  return component
  && (typeof component === 'function')
  && (!component.prototype || !component.prototype.render)
  && !component.isReactClass
  && !Object.prototype.isPrototypeOf.call(React.Component, component);
}

export function isForwardComponent(component) {
  return component && (component.$$typeof === REACT_FORWARD_REF_TYPE) 
    && (typeof component.render === 'function');
}

export function isReactComponent(component) {
  return component && component.prototype && component.prototype.render
    && component.isReactClass;
}

export function resolveComponents(components, compName) {
  let comp = components[compName];
  if (!isProduction && !comp) warn(`can not resolve component '${compName}'!`, this);
  return comp || compName;
}
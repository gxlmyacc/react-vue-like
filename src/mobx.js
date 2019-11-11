import {
  toJS, isObservable, isObservableProp, isObservableObject, isObservableArray, isObservableMap, isBoxedObservable,
  isArrayLike, isAction, isComputed, isComputedProp,
  observable, extendObservable, observe, decorate, reaction, intercept,
  computed, action, autorun, when, runInAction, createAtom,
  set, get, remove, has, flow, configure,
  onBecomeObserved, onBecomeUnobserved
} from 'mobx';
import config from './config';
import collect from './collect';

const _toString = Object.prototype.toString;
export function isGenerator(fn) {
  return fn && (_toString.call(fn.prototype) === '[object Generator]');
}
export function isAsync(fn) {
  return fn && (_toString.call(fn) === '[object AsyncFunction]');
}

function newConfigure(options = {}) {
  config.enforceActions = (options.enforceActions !== undefined) && (options.enforceActions !== 'never');
  return configure(Object.assign({ isolateGlobalState: true }, options));
}

function newIsAction(fn) {
  return isAction(fn) || fn.isMobxFlow;
}

function wrapActionFn(actionFn, fn) {
  const res = function res() {
    return collect.isRendering ? fn.apply(this, arguments) : actionFn.apply(this, arguments);
  };
  res.isMobxAction = true;
  return res;
}

function newFlow(target, name, descriptor) {
  let value;
  if (arguments.length === 1) {
    value = flow(target);
    value._source = target;
  } else {
    value = flow(descriptor.value);
    value._source = descriptor.value;
    descriptor.value = value;
  }
  value.isMobxFlow = true;
  return descriptor || value;
}

function newAction(target, name, descriptor) {
  let value;
  if (!descriptor || !descriptor.value) {
    let _fn = name || target;
    if (newIsAction(_fn)) value = _fn;
    else {
      value = isGenerator(_fn) ? flow(_fn) : wrapActionFn(action.apply(this, arguments), _fn);
      value._source = _fn;
    }
  } else if (!newIsAction(descriptor.value)) {
    value = isGenerator(descriptor.value)
      ? flow(descriptor.value)
      : wrapActionFn(action(name, descriptor.value), descriptor.value);
    value._source = descriptor.value;
    descriptor.value = value;
  }
  return descriptor || value;
}

export {
  toJS, isObservable, isObservableProp, isObservableObject, isObservableArray, isObservableMap, isBoxedObservable,
  isArrayLike, isComputed, isComputedProp,
  observable, extendObservable, observe, decorate, reaction, intercept,
  computed, autorun, when, runInAction, createAtom,
  set, get, remove, has,
  onBecomeObserved, onBecomeUnobserved,
  newFlow as flow,
  newAction as action,
  newConfigure as configure,
  newIsAction as isAction
};


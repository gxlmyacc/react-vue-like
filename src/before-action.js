import { action, flow } from './mobx';
import { isFunction } from './utils';

const reserved = [
  'constructor',
  'data',
  'provide',
  'shouldComponentUpdate',
  'render',
  'renderError',
];

function _handleAction(target, key, flows) {
  let v = target[key];
  if (!isFunction(v)) return;
  let isFlow = flows.includes(key);
  let n = isFlow ? flow(v) : action(key, v);
  if (v !== n) target[key] = n;
}

export default function beforeAction(target, ReactVueLike) {
  if (!target) return;
  let flows = target.__flows || [];
  if (target.methods) {
    Object.keys(target.methods).forEach(key => _handleAction(target.methods, key, flows));
  }
  Object.getOwnPropertyNames(target.prototype)
    .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
  // Object.getOwnPropertyNames(target)
  //   .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
}

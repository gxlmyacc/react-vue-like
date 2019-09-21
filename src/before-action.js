import { action, flow } from './mobx';
import { isFunction } from './utils';

const reserved = [
  'constructor',
  'data',
  'provide',
  'render',
  'renderError'
];

function _handleAction(target, key, flows) {
  let v = target[key];
  if (!isFunction(v)) return;
  let n = flows.includes(key) ? flow(v) : action(key, v);
  if (v !== n) target[key] = n;
}

export default function beforeAction(target) {
  if (!target) return;
  let flows = target.__flows || [];
  if (target.methods) {
    Object.keys(target.methods).forEach(key => _handleAction(target.methods, key, flows));
  }
  Object.getOwnPropertyNames(target.prototype)
    .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
}

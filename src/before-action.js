import { action } from './mobx';
import { isFunction } from './utils';

const reserved = [
  'constructor',
  'data',
  'provide',
  'render',
];

function _handleAction(target, key) {
  let v = target[key];
  if (!isFunction(v)) return;
  let n = action(key, v);
  if (v !== n) target[key] = n;
}

export default function beforeAction(target) {
  if (!target) return;
  if (target.methods) {
    Object.keys(target.methods).forEach(key => _handleAction(target.methods, key));
  }
  Object.getOwnPropertyNames(target.prototype)
    .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key));
}

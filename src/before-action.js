import { action, flow } from './mobx';
import { isFunction, VUELIKE_PREFIX } from './utils';
import { VUELIKE_METHODS } from './component';

const RESERVED_METHODS = [
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

export default function beforeAction(target) {
  if (!target) return;
  let flows = target.__flows || [];
  if (target.methods) {
    Object.keys(target.methods).forEach(key => _handleAction(target.methods, key, flows));
  }
  let reserved = RESERVED_METHODS;
  if (target[`${VUELIKE_PREFIX}Wrapper`]) reserved = reserved.concat(VUELIKE_METHODS);
  target.prototype && Object.getOwnPropertyNames(target.prototype)
    .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
  // Object.getOwnPropertyNames(target)
  //   .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
}

import { action, flow } from './mobx';
import { isFunction, ClassPropertyNames } from './utils';
import ReactVueLike from './component';

const RESERVED_METHODS = [
  'constructor',
  'data',
  'provide',
  'shouldComponentUpdate',
  'render',
  'renderError',
];

const VUE_LIKE_METHODS = Object.getOwnPropertyNames(ReactVueLike.prototype).filter(key => !ClassPropertyNames.includes(key));

function _handleAction(target, key, flows) {
  let v = target[key];
  if (!isFunction(v)) return;
  let isFlow = flows.includes(key);
  let n = isFlow ? flow(v) : action(key, v);
  if (v !== n) target[key] = n;
}

export {
  VUE_LIKE_METHODS
};

export default function beforeAction(target) {
  if (!target) return;
  let flows = target.__flows || [];
  if (target.methods) {
    Object.keys(target.methods).forEach(key => _handleAction(target.methods, key, flows));
  }
  let reserved = RESERVED_METHODS;
  if (target.__vuelikeWrapper) reserved = reserved.concat(VUE_LIKE_METHODS);
  target.prototype && Object.getOwnPropertyNames(target.prototype)
    .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
  // Object.getOwnPropertyNames(target)
  //   .forEach(key => !reserved.includes(key) && _handleAction(target.prototype, key, flows));
}

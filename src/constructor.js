import { isVueLikeClass, hasOwnProperty, innumerable  } from './utils';
import beforeCollect from './before-collect';
import beforeProps from './before-props';
import beforeAction, { VUE_LIKE_METHODS } from './before-action';

import ReactVueLike from './component';

const REACT_LIFECYCLE_HOOKS = [
  'render',
  'renderError',
  'componentDidMount',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentDidActivate',
  'componentWillUnactivate',
  'componentWillUnmount',
  'componentDidCatch'
];

function replaceVueLikeProto(target) {
  let ret = {};
  let isVueLike = isVueLikeClass(target);
  let tp = target.prototype; 
  const tm = Object.getOwnPropertyNames(tp);
  let methods = isVueLike ? REACT_LIFECYCLE_HOOKS : VUE_LIKE_METHODS;
  methods.forEach(key => {
    let sfn = ReactVueLike.prototype[key];
    if (isVueLike && !tm.includes(key)) return;
    let tfn = tp[key];
    if (tfn) {
      tp[key] = sfn;
      ret[key] = tfn;
    } else if (!isVueLike) innumerable(tp, key, sfn);
  });
  return ret;
}

function walkMixins(mixins, target) {
  mixins.forEach(mixin => {
    // eslint-disable-next-line
    if (mixin.props) target = beforeProps(mixin, target);

    beforeAction(mixin);
  });
}

function vuelikeConstructor(target, props, children) {
  if (target.vuelikeProto) return;

  const vuelikeProto = replaceVueLikeProto(target);
  innumerable(target, 'vuelikeProto', vuelikeProto);
  if (hasOwnProperty(target.prototype, 'shouldComponentUpdate')) {
    vuelikeProto.shouldComponentUpdate = target.prototype.shouldComponentUpdate;
    delete target.prototype.shouldComponentUpdate;
  }

  beforeCollect(vuelikeProto, ReactVueLike);

  // Object.keys(props).forEach(key => {
  //   if (!/^\$/.test(key)) return;
  //   Object.defineProperty(props, key, Object.assign(Object.getOwnPropertyDescriptor(props, key), { enumerable: false }));
  // });
  if (props.ref) {
    props.$ref = props.ref;
    // innumerable(props, '$ref', props.ref);
    delete props.ref;
  }

  let mixins = [target];
  if (target.mixins) Array.prototype.push.apply(mixins, target.mixins);
 
  walkMixins(mixins, target);
}

export {
  VUE_LIKE_METHODS,
  REACT_LIFECYCLE_HOOKS
};

export default vuelikeConstructor;
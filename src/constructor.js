import { isVueLikeClass, hasOwnProperty, innumerable  } from './utils';
import beforeCollect from './before-collect';
import beforeProps from './before-props';
import beforeAction from './before-action';
import beforeClass from './before-class';

import ReactVueLikeComponent, { VUE_LIKE_METHODS } from './component';

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
    if (isVueLike && !tm.includes(key)) return;
    let sfn = ReactVueLikeComponent.prototype[key];
    if (hasOwnProperty(tp, key)) {
      let tfn = tp[key];
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

  beforeCollect(vuelikeProto, ReactVueLikeComponent);

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

function otherConstructor(props) {
  if (!props) return;
  if (props.$slots) delete props.$slots;
  // Object.keys(props).forEach(key => {
  //   if (!/^\$\S+/.test(key)) return;
  //   delete props[key];
  // });
}

function fallbackConstructor(props) {
  beforeClass(props);
}


export {
  VUE_LIKE_METHODS,
  REACT_LIFECYCLE_HOOKS,
  fallbackConstructor,
  otherConstructor
};

export default vuelikeConstructor;
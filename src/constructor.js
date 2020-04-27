import { isVueLikeComponent, hasOwnProperty, innumerable } from './utils';
import beforeCollect from './before-collect';
import beforeProps from './before-props';
import beforeAction from './before-action';

import ReactVueLike from './component';

function replaceVueLikeProto(target) {
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
  let ret = {};
  let isVueLike = isVueLikeComponent(target);
  let tp = target.prototype; 
  const tm = Object.getOwnPropertyNames(tp);
  REACT_LIFECYCLE_HOOKS.forEach(key => {
    let sfn = ReactVueLike.prototype[key];
    if (!tm.includes(key)) return;
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

  Object.keys(props).forEach(key => /^\$/.test(key) && innumerable(props, key, props[key]));
  if (props.ref) {
    innumerable(props, '$ref', props.ref);
    delete props.ref;
  }

  let mixins = [target];
  if (target.mixins) Array.prototype.push.apply(mixins, target.mixins);
 
  walkMixins(mixins, target);
}

export default vuelikeConstructor;
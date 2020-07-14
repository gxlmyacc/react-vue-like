// import React from 'react';
import { isVuelikeComponentClass, hasOwnProperty, innumerable  } from './utils';
import beforeCollect from './before-collect';
import beforeProps from './before-props';
import beforeAction from './before-action';

import VuelikeComponent, { VUELIKE_METHODS } from './component';

const REACT_LIFECYCLE_HOOKS = [
  'render',
  'renderError',
  'componentWillMount',
  'componentDidMount',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentDidActivate',
  'componentWillUnactivate',
  'componentWillUnmount',
  'componentDidCatch',
  'componentEachJSXElement',
  'componentEachRootJSXElement'
];

function replaceVuelikeProto(target, prefix = '') {
  let ret = {};
  let tp = target.prototype; 
  const tm = Object.getOwnPropertyNames(tp);
  REACT_LIFECYCLE_HOOKS.forEach(key => {
    let tfn = tm.includes(key) ? tp[key] : null;
    if (!tfn && prefix && tm.includes(prefix + key)) tfn = tp[prefix + key];
    if (!tfn) return;
    let sfn = VuelikeComponent.prototype[key];
    
    if (sfn) tp[key] = sfn;
    else delete tp[key];

    ret[key] = tfn;
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

function vuelikeInject(target) {
  if (target.vuelikeProto || !isVuelikeComponentClass(target)) return;

  const vuelikeProto = replaceVuelikeProto(target, 'UNSAFE_');
  innumerable(target, 'vuelikeProto', vuelikeProto);
  if (hasOwnProperty(target.prototype, 'shouldComponentUpdate')) {
    vuelikeProto.shouldComponentUpdate = target.prototype.shouldComponentUpdate;
    delete target.prototype.shouldComponentUpdate;
  }

  beforeCollect(vuelikeProto, VuelikeComponent);

  let mixins = [target];
  if (target.mixins) Array.prototype.push.apply(mixins, target.mixins);
 
  walkMixins(mixins, target);

  return target;
  // const newTarget = React.forwardRef((props, ref) => {
  //   React.createElement(target, Object.assign({ $ref: ref }, props, props.children));
  // });
  // innumerable(newTarget, '__component', target);
  // return newTarget;
}


function vuelikeConstructor(target, props, children) {
  // vuelikeInject(target);
  
  // Object.keys(props).forEach(key => {
  //   if (!/^\$/.test(key)) return;
  //   Object.defineProperty(props, key, Object.assign(Object.getOwnPropertyDescriptor(props, key), { enumerable: false }));
  // });
  if (props.ref) {
    props.$ref = props.ref;
    // innumerable(props, '$ref', props.ref);
    delete props.ref;
  }
}

export {
  VUELIKE_METHODS,
  REACT_LIFECYCLE_HOOKS,
  vuelikeInject
};

export default vuelikeConstructor;
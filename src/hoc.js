
import React from 'react';
// import { observer } from 'mobx-react';
import { innumerable } from './utils';
import ReactVueLikeComponent from './component';
import vuelikeConstructor from './constructor';

function withVuelike(target) {
  if (target.vuelikeConstructor || !target.prototype) return target;
  if (!(target.prototype instanceof React.Component)) return target;

  // class VueLikeWrapper extends target {

  //   constructor(props) {
  //     super(props);
  //     this._createInstance(props, target, VueLikeWrapper);
  //   }
  
  // }
  // VueLikeWrapper.Component = target;
  // VueLikeWrapper.displayName = target.displayName || target.name;

  // const render = target.prototype.render;
  // target = observer(target);
  // target.prototype.render = render;

  // eslint-disable-next-line no-proto
  const oldConstructor = target.__proto__;
  function VueLikeWrapper(props) {
    oldConstructor.apply(this, arguments);
    this._createInstance(props, target);
  }
  // VueLikeWrapper.prototype = Object.assign(target.prototype, {
  //   constructor: VueLikeWrapper
  // });
  target.prototype.prototype = ReactVueLikeComponent.prototype;
  // eslint-disable-next-line no-proto
  target.__proto__ = VueLikeWrapper;

  innumerable(target, 'vuelikeConstructor', function (target, props, children) {
    return vuelikeConstructor(target, props, children);
  });
  innumerable(target, '__vuelikeWrapper', true);

  return target;
}


export default withVuelike;
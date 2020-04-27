
import { isVueLikeComponent, innumerable, replaceMethods, VUE_LIKE_CLASS } from './utils';
import ReactVueLike from './component';
import beforeConstructor from './before-constructor';

function vuelike(target) {
  let proto = target.prototype;
  if (!proto || isVueLikeComponent(proto)) return target;

  class VueLikeWrapper extends target {
     
    constructor(props) {
      super(props);
      ReactVueLike.prototype._createInstance.call(this, props);
    }
  
  }

  replaceMethods(VueLikeWrapper, target);
  replaceMethods(VueLikeWrapper.prototype, proto);

  innumerable(VueLikeWrapper, 'beforeConstructor', beforeConstructor);
  innumerable(VueLikeWrapper, VUE_LIKE_CLASS, true);
  innumerable(VueLikeWrapper, '__vuelikeWrapper', true);

  return VueLikeWrapper;
}

export default vuelike;
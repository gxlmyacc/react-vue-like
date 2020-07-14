import {
  VUELIKE_PREFIX,
  innumerable
} from './utils';

class VuelikeMixin {

  static isVuelikeMixin = true;

}

innumerable(VuelikeMixin, `${VUELIKE_PREFIX}MixinClass`, true);


export default VuelikeMixin;

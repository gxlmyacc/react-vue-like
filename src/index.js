import ReactVueLike from './component';
import withVuelike from './hoc';
import Directive from './directive';
import Mixin from './mixin';
import hook from './hook';
import { innumerable } from './utils';
import vuelikeConstructor from './constructor';

export * from './utils';

ReactVueLike.Mixin = Mixin;
ReactVueLike.Directive = Directive;

innumerable(ReactVueLike, 'vuelikeConstructor', vuelikeConstructor);
innumerable(ReactVueLike, '_ce', hook.createElement);
innumerable(ReactVueLike, '_cc', hook.cloneElement);

export {
  Directive as ReactVueLikeDirective,
  withVuelike
};

hook();

export default ReactVueLike;

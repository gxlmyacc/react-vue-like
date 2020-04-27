import { isObservable, observable, extendObservable, flow, action, remove } from './mobx';
import ReactVueLike from './component';
import vuelike from './hoc';
import Directive from './directive';
import Mixin from './mixin';
import hook from './hook';
import { checkKeyCodes } from './utils';
import beforeConstructor from './before-constructor';

export * from './utils';


ReactVueLike.beforeConstructor = beforeConstructor;

ReactVueLike.Mixin = Mixin;
ReactVueLike.Directive = Directive;
ReactVueLike.observable = observable;
ReactVueLike.flow = flow;
ReactVueLike.action = action;
ReactVueLike._k = checkKeyCodes;
ReactVueLike.set = ReactVueLike.prototype.$set;
ReactVueLike.delete = remove;
ReactVueLike.isObservable = isObservable;
ReactVueLike.extendObservable = extendObservable;

vuelike.Component = ReactVueLike;

export {
  Directive as ReactVueLikeDirective,
  vuelike
};

hook();

export default ReactVueLike;

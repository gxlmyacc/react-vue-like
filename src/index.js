import { isObservable, observable, extendObservable, flow, action, remove } from './mobx';
import ReactVueLike from './component';
import Directive from './directive';
import Mixin from './mixin';
import hook from './hook';
import { checkKeyCodes } from './utils';

export * from './utils';

ReactVueLike.Mixin = Mixin;
ReactVueLike.observable = observable;
ReactVueLike.flow = flow;
ReactVueLike.action = action;
ReactVueLike._k = checkKeyCodes;
ReactVueLike.set = ReactVueLike.prototype.$set;
ReactVueLike.delete = remove;
ReactVueLike.isObservable = isObservable;
ReactVueLike.extendObservable = extendObservable;

export {
  Directive as ReactVueLikeDirective
};

hook();

export default ReactVueLike;

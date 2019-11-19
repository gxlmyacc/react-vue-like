import { isObservable, observable, flow, action, set, remove } from './mobx';
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
ReactVueLike.set = set;
ReactVueLike.delete = remove;
ReactVueLike.isObservable = isObservable;

export {
  Directive as ReactVueLikeDirective
};

hook();

export default ReactVueLike;

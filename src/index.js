import { observable, flow, action } from './mobx';
import ReactVueLike from './component';
import Directive from './directive';
import Mixin from './mixin';
import Store from './store';
import hook from './hook';
import { checkKeyCodes } from './utils';

export * from './utils';
export * from './store-helpers';

ReactVueLike.Mixin = Mixin;
ReactVueLike.observable = observable;
ReactVueLike.flow = flow;
ReactVueLike.action = action;
ReactVueLike._k = checkKeyCodes;

export {
  Store,
  Directive as ReactVueLikeDirective
};

hook();

export default ReactVueLike;

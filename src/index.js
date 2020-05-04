import ReactVueLikeComponent from './component';
import withVuelike from './hoc';
import Directive from './directive';
import Mixin from './mixin';
import hook from './hook';
import { innumerable, checkKeyCodes, defaultMergeStrategies, directivesMergeStrategies, filtersMergeStrategies } from './utils';
import vuelikeConstructor from './constructor';
import ReactVueLike from './vue-like';
import { observable, isObservable, extendObservable, remove, action, runInAction, flow } from './mobx';
import config from './config';

export * from './utils';

innumerable(ReactVueLikeComponent, 'vuelikeConstructor', vuelikeConstructor);


Object.assign(config.optionMergeStrategies, {
  $directives: directivesMergeStrategies,
  $filters: filtersMergeStrategies,
  $vuelike: defaultMergeStrategies,
});

const STATIC_METHODS = {
  Mixin,
  Directive,
  Component: ReactVueLikeComponent,
  runAction: runInAction,
  set: ReactVueLikeComponent.prototype.$set,
  delete: ReactVueLikeComponent.prototype.$delete,
  remove,
  observable,
  flow,
  action,
  isObservable,
  extendObservable,
  _k: checkKeyCodes
};

Object.keys(STATIC_METHODS).forEach(key => {
  innumerable(ReactVueLike, key, STATIC_METHODS[key]);
  innumerable(ReactVueLike.prototype, key, STATIC_METHODS[key]); 
  innumerable(ReactVueLikeComponent, key, STATIC_METHODS[key]);
});

innumerable(ReactVueLike, 'build', __timestamp);

innumerable(ReactVueLike, '_ce', hook.createElement);
innumerable(ReactVueLike, '_cc', hook.cloneElement);

export {
  Directive as ReactVueLikeDirective,
  withVuelike
};

hook();

export default ReactVueLike;

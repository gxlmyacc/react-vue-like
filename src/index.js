import { useLocalStore, useObserver } from 'mobx-react-lite';
import VuelikeComponent from './component';
import Directive from './directive';
import Mixin from './mixin';
import Slot from './slot';
import hook from './hook';
import classNames from './classnames';
import { innumerable, checkKeyCodes, defaultMergeStrategies, directivesMergeStrategies, filtersMergeStrategies } from './utils';
import vuelikeConstructor, { vuelikeInject } from './constructor';
import Vuelike from './vuelike';
import { observable, isObservable, extendObservable, observe, toJS, remove, action, runInAction, flow } from './mobx';
import config from './config';

export * from './utils';

innumerable(VuelikeComponent, 'vuelikeConstructor', vuelikeConstructor);

Object.assign(config.optionMergeStrategies, {
  $directives: directivesMergeStrategies,
  $filters: filtersMergeStrategies,
  $vuelike: defaultMergeStrategies,
});

const STATIC_METHODS = {
  Mixin,
  Directive,
  Component: VuelikeComponent,
  Slot,
  runAction: runInAction,
  set: VuelikeComponent.prototype.$set,
  delete: VuelikeComponent.prototype.$delete,
  remove,
  observable,
  observe,
  toJS,
  flow,
  action,
  isObservable,
  extendObservable,
  _k: checkKeyCodes,
  _a: action,
  _cn: classNames,
  useLocalStore,
  useObserver
};

Object.keys(STATIC_METHODS).forEach(key => {
  innumerable(Vuelike, key, STATIC_METHODS[key]);
  innumerable(Vuelike.prototype, key, STATIC_METHODS[key]); 
  innumerable(VuelikeComponent, key, STATIC_METHODS[key]);
});

innumerable(Vuelike, 'build', __timestamp);

innumerable(Vuelike, '_ce', hook.createElement);
hook();

export {
  vuelikeInject
};

export default Vuelike;

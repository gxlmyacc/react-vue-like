import { observable } from 'mobx';
import ReactVueLike from './component';
import ReactVueLikeDirective from './directive';
import Store from './store';

export { default as propcheck } from './prop-check';

export * from './utils';

ReactVueLike.Store = Store;
ReactVueLike.observable = observable;

export {
  ReactVueLikeDirective
};

export default ReactVueLike;

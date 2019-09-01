import ReactVueLike from './component';
import Directive from './Directive';
import Store from './store';

export { default as propcheck } from './prop-check';

export * from './utils';

ReactVueLike.Store = Store;
ReactVueLike.Directive = Directive;

export default ReactVueLike;

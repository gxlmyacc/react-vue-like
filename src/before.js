import ReactVueLike from './component';
import Directive from './directive';
import Mixin from './mixin';
import beforeProps from './before-props';
import beforeAction from './before-action';

export default function before(source, props, target) {
  if (!source || !source.prototype) return source;
  if (source.__ReactVueLikeHandled) return source;

  const isReactVueLikeClass = source.prototype instanceof ReactVueLike;
  const isReactVueLikeClasses = isReactVueLikeClass || source.prototype instanceof Mixin;
  const isReactVueLike = isReactVueLikeClasses || source === Directive;

  if (!isReactVueLike) return source;
  try {
    if (!target) target = source;

    if (props) {
      if (props.ref) {
        props.$ref = props.ref;
        delete props.ref;
      }
    }

    if (!isReactVueLikeClasses) return target;

    if (isReactVueLikeClass && target.mixins) {
      target.mixins.forEach((m, i) => before(m, props, target));
    }

    // eslint-disable-next-line
    if (source.props) target = beforeProps(source, target);

    beforeAction(target);

    return target;
  } finally {
    Object.defineProperty(target, '__ReactVueLikeHandled', {
      writable: true,
      configurable: true,
      value: true
    });
  }
}
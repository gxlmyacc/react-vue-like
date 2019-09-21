import ReactVueLike from './component';
import Directive from './directive';
import Mixin from './mixin';
import beforeProps from './before-props';
import beforeAction from './before-action';

function isReactComponent(source) {
  if (typeof source !== 'string') return true;
  if (source.includes('.')) return true;
  return false;
}

export default function before(source, props, target, isMixin) {
  if (!source || !source.prototype) return source;
  if (source.__ReactVueLikeHandled) return source;

  const isReactVueLikeClass = source.prototype instanceof ReactVueLike;
  const isReactVueLikeMixin = isMixin || source.prototype instanceof Mixin;
  const isDirective = source === Directive;
  const isReactVueLikeClasses = isReactVueLikeClass || isReactVueLikeMixin;
  const isReactVueLike = isReactVueLikeClasses || isDirective;

  if (!isReactVueLike || (isDirective && isReactComponent(props._source))) {
    if (props && props.$slots) {
      Object.assign(props, props.$slots);
      delete props.$slots;
    }
  }

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
      target.mixins.forEach((m, i) => before(m, props, target, true));
    }

    // eslint-disable-next-line
    if (source.props) target = beforeProps(source, target);

    beforeAction(source);

    return target;
  } finally {
    Object.defineProperty(target, '__ReactVueLikeHandled', {
      writable: true,
      configurable: true,
      value: true
    });
  }
}

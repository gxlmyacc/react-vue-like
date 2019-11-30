import ReactVueLike from './component';
import Mixin from './mixin';
import Directive from './directive';
import beforeProps from './before-props';
import beforeAction from './before-action';
import beforeRender from './before-render';
import beforeClass from './before-class';

function isVueLikeComponent(source) {
  return source && source.prototype instanceof ReactVueLike;
}

function isMixinComponent(source) {
  return source && source.prototype instanceof Mixin;
}

export default function before(source, props, target, isMixin) {
  if (!isMixin) beforeClass(props);

  const isReactVueLikeClass = isVueLikeComponent(source);
  const isReactVueLikeMixin = isMixin || isMixinComponent(source);
  const isDirective = source === Directive;
  const isReactVueLikeClasses = isReactVueLikeClass || isReactVueLikeMixin;

  if (!isReactVueLikeClasses || (isDirective && !isVueLikeComponent(props._source))) {
    if (props) {
      if (props.$slots) {
        Object.assign(props, props.$slots);
        delete props.$slots;
      }
    }
  } else {
    if (props) {
      if (props.ref) {
        props.$ref = props.ref;
        delete props.ref;
      }
    }
  }

  if (!source || !source.prototype || source.__ReactVueLikeHandled) return source;

  if (!isReactVueLikeClasses) return source;
  try {
    if (!target) target = source;

    if (isReactVueLikeClass && target.mixins) {
      target.mixins.forEach((m, i) => before(m, props, target, true));
    }

    // eslint-disable-next-line
    if (source.props) target = beforeProps(source, target);

    beforeAction(source);
    beforeRender(source);

    return target;
  } finally {
    Object.defineProperty(target, '__ReactVueLikeHandled', {
      writable: true,
      configurable: true,
      value: true
    });
  }
}

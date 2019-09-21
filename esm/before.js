"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = before;

var _component = _interopRequireDefault(require("./component"));

var _directive = _interopRequireDefault(require("./directive"));

var _mixin = _interopRequireDefault(require("./mixin"));

var _beforeProps = _interopRequireDefault(require("./before-props"));

var _beforeAction = _interopRequireDefault(require("./before-action"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isReactComponent(source) {
  if (typeof source !== 'string') return true;
  if (source.includes('.')) return true;
  return false;
}

function before(source, props, target, isMixin) {
  if (!source || !source.prototype) return source;
  if (source.__ReactVueLikeHandled) return source;
  const isReactVueLikeClass = source.prototype instanceof _component.default;
  const isReactVueLikeMixin = isMixin || source.prototype instanceof _mixin.default;
  const isDirective = source === _directive.default;
  const isReactVueLikeClasses = isReactVueLikeClass || isReactVueLikeMixin;
  const isReactVueLike = isReactVueLikeClasses || isDirective;

  if (!isReactVueLike || isDirective && isReactComponent(props._source)) {
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
      target.mixins.forEach(function (m, i) {
        return before(m, props, target, true);
      });
    } // eslint-disable-next-line


    if (source.props) target = (0, _beforeProps.default)(source, target);
    (0, _beforeAction.default)(source);
    return target;
  } finally {
    Object.defineProperty(target, '__ReactVueLikeHandled', {
      writable: true,
      configurable: true,
      value: true
    });
  }
}
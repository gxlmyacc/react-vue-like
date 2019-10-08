"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = before;

var _component = _interopRequireDefault(require("./component"));

var _mixin = _interopRequireDefault(require("./mixin"));

var _directive = _interopRequireDefault(require("./directive"));

var _beforeProps = _interopRequireDefault(require("./before-props"));

var _beforeAction = _interopRequireDefault(require("./before-action"));

var _beforeClass = _interopRequireDefault(require("./before-class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isVueLikeComponent(source) {
  return source && source.prototype instanceof _component.default;
}

function isMixinComponent(source) {
  return source && source.prototype instanceof _mixin.default;
}

function before(source, props, target, isMixin) {
  if (!isMixin) (0, _beforeClass.default)(props);
  const isReactVueLikeClass = isVueLikeComponent(source);
  const isReactVueLikeMixin = isMixin || isMixinComponent(source);
  const isDirective = source === _directive.default;
  const isReactVueLikeClasses = isReactVueLikeClass || isReactVueLikeMixin;

  if (!isReactVueLikeClasses || isDirective && !isVueLikeComponent(props._source)) {
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
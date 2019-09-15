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

function before(source, props, target) {
  if (!source || !source.prototype) return source;
  if (source.__ReactVueLikeHandled) return source;
  var isReactVueLikeClass = source.prototype instanceof _component.default;
  var isReactVueLikeClasses = isReactVueLikeClass || source.prototype instanceof _mixin.default;
  var isReactVueLike = isReactVueLikeClasses || source === _directive.default;
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
        return before(m, props, target);
      });
    } // eslint-disable-next-line


    if (source.props) target = (0, _beforeProps.default)(source, target);
    (0, _beforeAction.default)(target);
    return target;
  } finally {
    Object.defineProperty(target, '__ReactVueLikeHandled', {
      writable: true,
      configurable: true,
      value: true
    });
  }
}
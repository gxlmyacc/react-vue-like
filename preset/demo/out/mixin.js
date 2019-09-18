"use strict";

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function () {
  var _class, _temp, _temp2;

  return _temp = (_temp2 = _class = class MixinTest extends _reactVueLike.default.Mixin {
    static data() {
      return {
        namespace: '',
        loaded: false
      };
    }

    mounted() {
      var _this = this;

      return (
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var module, params;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                module = _this.props.module;

                if (module) {
                  _context.next = 3;
                  break;
                }

                throw Error('加载外部模块失败：props.module参数不能为空!');

              case 3:
                _this.$external.current = module;
                params = _objectSpread({
                  customer: _this.customer,
                  account: _this.account
                }, _this.$attrs.initOptions || {});
                console.log('init params', params);
                _context.next = 8;
                return module.init(params);

              case 8:
                if (module.namespace) _this.namespace = module.namespace;
                _this.loaded = true;
                module.render(_this.$el, _this.renderProps || {});

              case 11:
              case "end":
                return _context.stop();
            }
          }, _callee);
        })()
      );
    }

    beforeDestory() {
      if (this.$external.current === this.module) {
        this.$external.current = null;
      }
    }

  }, _class.__flows = ["mounted"], _temp2), _defineProperty(_class, "computed", {
    account() {
      return this.$store.state.account;
    },

    customer() {
      return this.$store.state.customer;
    }

  }), _defineProperty(_class, "methods", {
    testFn() {}

  }), _temp;
};
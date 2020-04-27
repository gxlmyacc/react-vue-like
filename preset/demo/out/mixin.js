"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.reflect.construct");

require("core-js/modules/es6.object.set-prototype-of");

require("regenerator-runtime/runtime");

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function () {
  var _class, _temp, _temp2, _temp3, _temp4;

  return _temp = (_temp4 = (_temp3 = (_temp2 = _class = /*#__PURE__*/function (_ReactVueLike$Mixin) {
    _inherits(MixinTest, _ReactVueLike$Mixin);

    var _super = _createSuper(MixinTest);

    function MixinTest() {
      _classCallCheck(this, MixinTest);

      return _super.apply(this, arguments);
    }

    _createClass(MixinTest, [{
      key: "mounted",
      value: /*#__PURE__*/regeneratorRuntime.mark(function mounted() {
        var module, params;
        return regeneratorRuntime.wrap(function mounted$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                module = this.props.module;

                if (module) {
                  _context.next = 3;
                  break;
                }

                throw Error('加载外部模块失败：props.module参数不能为空!');

              case 3:
                this.$external.current = module;
                params = _objectSpread({
                  customer: this.customer,
                  account: this.account
                }, this.$attrs.initOptions || {});
                console.log('init params', params);
                _context.next = 8;
                return module.init(params);

              case 8:
                if (module.namespace) this.namespace = module.namespace;
                this.loaded = true;
                module.render(this.$el, this.renderProps || {});

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, mounted, this);
      })
    }, {
      key: "beforeDestory",
      value: function beforeDestory() {
        if (this.$external.current === this.module) {
          this.$external.current = null;
        }
      }
    }], [{
      key: "data",
      value: function data() {
        return {
          namespace: '',
          loaded: false
        };
      }
    }]);

    return MixinTest;
  }(_reactVueLike.default.Mixin), _class.__flows = ["mounted"], _temp2), _class.__file = "/preset/demo/src/mixin.js", _temp3), _class.__vuelikeMixin = true, _temp4), _defineProperty(_class, "computed", {
    account: function account() {
      return this.$store.state.account;
    },
    customer: function customer() {
      return this.$store.state.customer;
    }
  }), _defineProperty(_class, "methods", {
    testFn: function testFn() {}
  }), _temp;
};
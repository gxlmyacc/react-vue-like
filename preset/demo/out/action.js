"use strict";

require("core-js/modules/es6.object.define-properties");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.filter");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("regenerator-runtime/runtime");

var _reactVueLike = _interopRequireWildcard(require("react-vue-like"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UpdatePwdModal =
/*#__PURE__*/
function (_ReactVueLike) {
  _inherits(UpdatePwdModal, _ReactVueLike);

  function UpdatePwdModal() {
    _classCallCheck(this, UpdatePwdModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(UpdatePwdModal).apply(this, arguments));
  }

  _createClass(UpdatePwdModal, null, [{
    key: "data",
    value: function data() {
      return {
        formData: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      };
    }
  }, {
    key: "staticTest",
    value: function () {
      var _staticTest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(data) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.aa.test();

              case 2:
                data.aa = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function staticTest(_x) {
        return _staticTest.apply(this, arguments);
      }

      return staticTest;
    }()
  }]);

  return UpdatePwdModal;
}(_reactVueLike["default"]);

UpdatePwdModal.__vuelike = true;
UpdatePwdModal.__file = "/preset/demo/src/action.js";

_defineProperty(UpdatePwdModal, "methods", {
  renderTest: function renderTest(row) {
    var _this = this;

    return _react["default"].createElement(_reactVueLike.Observer, null, function () {
      return _react["default"].createElement("dpl-popover", {
        $component: _this._c("DplPopover")
      }, _react["default"].createElement("dpl-input", {
        onChange: _this._a(function (e) {
          if (row.newPhone === e.target.value) return;
          row.newPhone = e.target.value;
          row.reason = '';
        }),
        onBlur: function onBlur(e) {
          if (row.phone === row.newPhone) return;

          _this.updatePhone(row);
        },
        $component: _this._c("DplInput")
      }));
    });
  } // async doOk() {
  //   this.props.form.validateFields(async (err, values) => {
  //     if (err) return;
  //     Object.assign(this.data, { dd });
  //     if (this.mode === 'apply') {
  //       await this.$api.privilege.applyPrivilege({
  //         position: this.formData.position,
  //         privileges: this.formData.privileges.join(',')
  //       });
  //       return this.endModal(true);
  //     }
  //     await this.$api.privilege.editAccountPrivilege({
  //       editedAccountId: this.account.accountId,
  //       position: this.formData.position,
  //       privileges: this.formData.privileges.join(',')
  //     });
  //     if (this.account === this.$store.state.account) {
  //       this.$store.commit('update-account-info', {
  //         position: this.formData.position,
  //         privileges: this.formData.privileges
  //       });
  //     } else {
  //       this.account.position = this.formData.position;
  //       this.account.privileges = this.formData.privileges;
  //     }
  //     this.endModal();
  //   });
  // },
  // doOk1() {
  //   this.$nextTick(() => this.aa++);
  // },
  // doOk2() {
  //   this.$nextTick(() => --this.aa);
  // },
  // doOk3() {
  //   this.$nextTick(() => this.aa += 1);
  // },
  // doOk4() {
  //   this.$nextTick(() => {
  //     let cc = null;
  //     cc = this.dd;
  //     cc.dd = 1;
  //   });
  // },
  // doOk5(cc) {
  //   this.$nextTick(cc => cc.dd = 1);
  // },

});

var test1 = _reactVueLike["default"].flow(
/*#__PURE__*/
regeneratorRuntime.mark(function test1() {
  return regeneratorRuntime.wrap(function test1$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  }, test1);
}));

var test2 = _reactVueLike["default"].flow(
/*#__PURE__*/
regeneratorRuntime.mark(function test1() {
  return regeneratorRuntime.wrap(function test1$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
        case "end":
          return _context3.stop();
      }
    }
  }, test1);
}));

var _default = _react["default"].forwardRef(function (props, ref) {
  return _react["default"].createElement(Form.create({})(UpdatePwdModal), _objectSpread({}, props, {
    wrappedComponentRef: ref
  }));
});

exports["default"] = _default;
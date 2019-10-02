"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireWildcard(require("react-vue-like"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UpdatePwdModal extends _reactVueLike.default {
  static data() {
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  }

}

UpdatePwdModal.__file = "/preset/demo/src/action.js";
UpdatePwdModal.__flows = ["doOk"];

_defineProperty(UpdatePwdModal, "methods", {
  doOk() {
    var _this = this;

    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _this.props.form.validateFields(_reactVueLike.default.flow(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, values) {
                return regeneratorRuntime.wrap(function _callee$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!err) {
                        _context3.next = 2;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 2:
                      Object.assign(this.data, {
                        dd
                      });

                      if (!(this.mode === 'apply')) {
                        _context3.next = 7;
                        break;
                      }

                      _context3.next = 6;
                      return this.$api.privilege.applyPrivilege({
                        position: this.formData.position,
                        privileges: this.formData.privileges.join(',')
                      });

                    case 6:
                      return _context3.abrupt("return", this.endModal(true));

                    case 7:
                      _context3.next = 9;
                      return this.$api.privilege.editAccountPrivilege({
                        editedAccountId: this.account.accountId,
                        position: this.formData.position,
                        privileges: this.formData.privileges.join(',')
                      });

                    case 9:
                      if (this.account === this.$store.state.account) {
                        this.$store.commit('update-account-info', {
                          position: this.formData.position,
                          privileges: this.formData.privileges
                        });
                      } else {
                        this.account.position = this.formData.position;
                        this.account.privileges = this.formData.privileges;
                      }

                      this.endModal();

                    case 11:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee, this);
              }).bind(_this)));

            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee2);
      })()
    );
  },

  doOk1() {
    var _this2 = this;

    this.$nextTick(this._resolveEvent(function () {
      return _this2.aa++;
    }));
  },

  doOk2() {
    var _this3 = this;

    this.$nextTick(this._resolveEvent(function () {
      return --_this3.aa;
    }));
  },

  doOk3() {
    var _this4 = this;

    this.$nextTick(this._resolveEvent(function () {
      return _this4.aa += 1;
    }));
  },

  doOk4() {
    var _this5 = this;

    this.$nextTick(function () {
      let cc = null;
      cc = _this5.dd;
      cc.dd = 1;
    });
  },

  doOk5(cc) {
    this.$nextTick(this._resolveEvent(function (cc) {
      return cc.dd = 1;
    }));
  }

});

const test1 = _reactVueLike.default.flow(
/*#__PURE__*/
regeneratorRuntime.mark(function test1() {
  return regeneratorRuntime.wrap(function test1$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
      case "end":
        return _context.stop();
    }
  }, test1);
}));

const test2 = _reactVueLike.default.flow(
/*#__PURE__*/
regeneratorRuntime.mark(function test1() {
  return regeneratorRuntime.wrap(function test1$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
      case "end":
        return _context2.stop();
    }
  }, test1);
}));

var _default = _react.default.forwardRef(function (props, ref) {
  return _react.default.createElement(Form.create({})(UpdatePwdModal), _objectSpread({}, props, {
    wrappedComponentRef: ref
  }));
});

exports.default = _default;
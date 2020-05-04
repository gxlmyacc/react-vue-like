"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireWildcard(require("react-vue-like"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UpdatePwdModal extends _reactVueLike.default {
  // static data() {
  //   return {
  //     // formData: {
  //     //   oldPassword: '',
  //     //   newPassword: '',
  //     //   confirmPassword: '',
  //     //   columns: [
  //     //     // { type: 'selection', }
  //     //     {
  //     //       prop: 'phone',
  //     //       minWidth: 120,
  //     //       render: (row, column, index) =>
  //     //         <dpl-popover v-observer control="full" type="error"
  //     //           getPopupContainer={() => this.tableBody}
  //     //           placement="left"
  //     //           padding="small"
  //     //           visible={Boolean(row.reason)}
  //     //           content={row.reason}>
  //     //           <dpl-input
  //     //             value={row.newPhone}
  //     //             maxLength="11"
  //     //             onChange={e => {
  //     //               if (row.newPhone === e.target.value) return;
  //     //               row.newPhone = e.target.value;
  //     //               row.reason = '';
  //     //             }}
  //     //             warn={row.reason}
  //     //             onBlur={e => {
  //     //               if (row.phone === row.newPhone) return;
  //     //               this.updatePhone(row);
  //     //             }}
  //     //           />
  //     //         </dpl-popover>
  //     //     },
  //     //   ]
  //     // }
  //   };
  // }
  // renderTable({ label, table: { columns } }) {
  //   return <div className="table-container">
  //     <a onClick={() => {
  //       this.formData[this.activeKey].push1({});
  //     }}>+ 添加{label}</a>
  //   </div>;
  // }
  // static async staticTest(data) {
  //   data.aa = await this.aa.test();
  // }
  $set(target, expr, value) {
    let _parseExpr = parseExpr(target, expr),
        obj = _parseExpr.obj,
        key = _parseExpr.key;

    if (obj && key) {
      if (value && !isObservable(value) && (isPlainObject(value) || Array.isArray(value))) value = observable(value);

      _reactVueLike.default.runAction(function () {
        return set(obj, key, value);
      });
    }
  }

}

UpdatePwdModal.__file = "/preset/demo/src/action.js";

_defineProperty(UpdatePwdModal, "methods", {// async doOk() {
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

UpdatePwdModal.__vuelike = true;
const test1 = flow(async function test1() {});

const test2 = _reactVueLike.default.flow(async function test1() {});

_reactVueLike.default.runAction(_reactVueLike.default.flow(function* () {
  this.aa = 1;
}.bind(void 0)));

var _default = _react.default.forwardRef(function (props, ref) {
  return _react.default.createElement(Form.create({})(UpdatePwdModal), _objectSpread({}, props, {
    wrappedComponentRef: ref
  }));
});

exports.default = _default;
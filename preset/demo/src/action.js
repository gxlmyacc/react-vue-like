import React from 'react';
import ReactVueLike, { action } from 'react-vue-like';

class UpdatePwdModal extends ReactVueLike.Component {

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

  renderTable({ label, table: { columns } }) {
    return <div className="table-container">
      <a onClick={() => {
        this.formData[this.activeKey].push1({});
      }}>+ 添加{label}</a>
    </div>;
  }

  // static async staticTest(data) {
  //   data.aa = await this.aa.test();
  // }

  static methods = {
    // async doOk() {
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
  }

  $set(target, expr, value) {
    let { obj, key } = parseExpr(target, expr);
    if (obj && key) {
      if (value && !isObservable(value) && (isPlainObject(value) || Array.isArray(value))) value = observable(value);
      ReactVueLike.runAction(() => set(obj, key, value));
    }
  }

}

const test1 = action(async function test1() {

});

const test2 = ReactVueLike.action(async function test1() {

});

ReactVueLike.runAction(async () => {
  this.aa = 1;
});

export default React.forwardRef((props, ref) => React.createElement(Form.create({})(UpdatePwdModal), {
  ...props,
  wrappedComponentRef: ref
}));

import React from 'react';
import ReactVueLike, { action } from 'react-vue-like';

class UpdatePwdModal extends ReactVueLike {

  static data() {
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    };
  }

  static async staticTest(data) {
    data.aa = await this.aa.test();
  }

  static methods = {
    renderTest(row) {
      return <dpl-popover v-observer>
        <dpl-input onChange={e => {
            if (row.newPhone === e.target.value) return;
            row.newPhone = e.target.value;
            row.reason = '';
          }}
          onBlur={e => {
            if (row.phone === row.newPhone) return;
            this.updatePhone(row);
          }}
        />
      </dpl-popover>
    },
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

}

const test1 = action(async function test1() {

});

const test2 = ReactVueLike.action(async function test1() {

});

export default React.forwardRef((props, ref) => React.createElement(Form.create({})(UpdatePwdModal), {
  ...props,
  wrappedComponentRef: ref
}));

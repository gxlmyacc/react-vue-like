/**
 * @file 修改密码-弹窗
 */

import React from 'react';
import ReactVueLike from 'react-vue-like';

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

  static methods = {
    async doOk() {
      await this.$api.account.updatePassword(this.formData);
      this.endModal();
      // console.log('doOk');
      this.props.form.validateFields(async (err, values) => {
        console.log('doOk 1');
        if (err) return;
        console.log('doOk 2');
        await this.$api.account.updatePassword(values);
        this.endModal();
      });
    },
  }

}

export default React.forwardRef((props, ref) => React.createElement(Form.create({})(UpdatePwdModal), {
  ...props,
  wrappedComponentRef: ref
}));

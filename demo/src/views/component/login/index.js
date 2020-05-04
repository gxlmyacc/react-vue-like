import React from 'react';
import router from 'router';
import ReactVueLike from 'react-vue-like';

class LoginIndex extends ReactVueLike.Component {

  static methods = {
    doLogin() {
      this.$store.commit('update-logined', true);
      router.push({
        path: '/home',
        query: { aa: 1 }
      }, () => {
        console.log('router.push is complete!');
      }, () => {
        console.log('router.push is abort!');
      });
    }
  }

  render() {
    return (
      <div>
        <h1>LoginIndex</h1>
        <button onClick={this.doLogin}>Login</button>
      </div>
    );
  }

}

export default LoginIndex;

import React from 'react';
import ReactVueLike from 'react-vue-like';
import router from 'router';

class HomeMainSomeIndex extends ReactVueLike {

  static data() {
    return {
      formData: {
        text: '1111',
      },
      text: 'text1'
    };
  }

  static computed = {
    logined() {
      return this.$store.state.logined;
    }
  }

  static methods = {
    refresh() {
      this.text = 'text1 refreshed';
    },
    toggleLogin() {
      this.$store.commit('update-logined', !this.logined);
    },
    delay(timeout = 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(timeout), timeout);
      });
    },
    async testAsync() {
      let i = 0;
      console.log('testAsync', i);
      while (i <= 5) {
        console.log('testAsync while', i);
        // this.$runAction(() => {
        //   this.text = i++;
        // });
        this.text = i++;
        let timeout = await this.delay(1000 + i);
        console.log('timeout', timeout);
      }
      console.log('testAsync end', i);
      this.text = '完成';
    }
  }

  render() {
    return (
      <div>
        <h1>HomeMainSomeIndex</h1>
        { this.text }
        <br />
        { this.formData.text }
        <br />
        logined: { String(this.logined) }
        <br />
        <input v-model={this.formData.text} />
        <button onClick={this.toggleLogin}>toggle login</button>
        <button onClick={this.testAsync}>test async</button>
        <button onClick={this.refresh}>refresh</button>
        <button onClick={() => router.push('other')}>to other</button>
      </div>
    );
  }

}

// function WrapComponent(Comp) {
//   return React.forwardRef((props, ref) => (<Comp {...props} ref={ref} />));
// }

export default HomeMainSomeIndex;

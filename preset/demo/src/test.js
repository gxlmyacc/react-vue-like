import React from 'react';
import ReactVueLike, {action} from 'react-vue-like';
import router from 'router';

class HomeMainSomeIndex extends ReactVueLike {

  static data() {
    return {
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
        this.text = i++;
        let timeout = await this.delay(1000 + i);
        console.log('timeout', timeout);
      }
      if (i > 4) {
        this.test = 'i > 4';
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
        logined: { String(this.logined) }
        <br />
        <input v-model={this.text} />
        <button onClick={this.toggleLogin}>toggle login</button>
        <button onClick={this.testAsync}>test async</button>
        <button onClick={this.refresh}>refresh</button>
        <button onClick={async () => router.push('other')}>to other</button>
      </div>
    );
  }

}

const test1 = action(function test1() {

})


const test2 = action(async function test2() {

});

// function WrapComponent(Comp) {
//   return React.forwardRef((props, ref) => (<Comp {...props} ref={ref} />));
// }

export default HomeMainSomeIndex;

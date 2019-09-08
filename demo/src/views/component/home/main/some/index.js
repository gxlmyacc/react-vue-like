import React from 'react';
import ReactVueLike from 'react-vue-like';
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
        <button onClick={this.toggleLogin}>toggle login</button>
        <button onClick={() => router.push('other')}>to other</button>
      </div>
    );
  }

}

// function WrapComponent(Comp) {
//   return React.forwardRef((props, ref) => (<Comp {...props} ref={ref} />));
// }

export default HomeMainSomeIndex;

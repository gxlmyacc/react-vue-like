import React from 'react';
import router from 'router';
import ReactVueLike from 'react-vue-like';

class HomeMainOtherIndex extends ReactVueLike {

  static data() {
    return {
      text: 'text1'
    };
  }

  static methods = {
    goSome() {
      router.push({
        path: 'some',
        query: { aa: 1 }
      }, () => {
        console.log('router.push some is complete!');
      }, () => {
        console.log('router.push some is abort!');
      });
    }
  }


  render() {
    return (
      <div>
        <h1>HomeMainOtherIndex</h1>
        { this.text }
        <button onClick={this.goSome}>to some</button>
      </div>
    );
  }

}

export default HomeMainOtherIndex;

import React from 'react';
import ReactVueLike from 'react-vue-like';

class HomeMainSomeFooter extends ReactVueLike {

  static data() {
    return {
      text: 'text1'
    };
  }

  render() {
    return (
      <div>
        <h1>HomeMainSomeFooter</h1>
        { this.text }
      </div>
    );
  }

}

export default HomeMainSomeFooter;

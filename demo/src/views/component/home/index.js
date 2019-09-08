import React from 'react';
import ReactVueLike from 'react-vue-like';
import { RouterView } from 'react-view-router';

class HomeIndex extends ReactVueLike {

  render() {
    return (
      <div>
        <h1>HomeIndex</h1>
        <RouterView />
      </div>
    );
  }

}

export default HomeIndex;

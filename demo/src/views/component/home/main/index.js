import React from 'react';
import ReactVueLike from 'react-vue-like';
import { RouterView } from 'react-view-router';

class HomeMainIndex extends ReactVueLike.Component {

  render() {
    return (
      <div>
        <h1>HomeMainIndex</h1>
        <RouterView />
        <RouterView name="footer" />
      </div>
    );
  }

}

export default HomeMainIndex;

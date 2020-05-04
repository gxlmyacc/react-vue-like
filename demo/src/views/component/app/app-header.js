import React from 'react';
import ReactVueLike from 'react-vue-like';
import AppHeaderLeft from './app-header-left';

class AppHeader extends ReactVueLike.Component {

  render() {
    return (<AppHeaderLeft className="app-header-left">
      <h1>App Header</h1>
    </AppHeaderLeft>);
  }

}

export default AppHeader;

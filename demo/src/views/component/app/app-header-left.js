import React from 'react';
import ReactVueLike from 'react-vue-like';

class AppHeaderLeft extends ReactVueLike.Component {

  render() {
    return (<div {...this.props}>
      <h1>App Header Left</h1>
      { this.props.children }
    </div>);
  }

}

export default AppHeaderLeft;

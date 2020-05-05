import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike.Component {


  render() {
    return (<div class="root">
      <a-component a="1" b={2} c={{...this.props}}>1</a-component>
      <b-component a="1" b={2} c={{...this.props}} />
    </div>);
  }

}

export default App;

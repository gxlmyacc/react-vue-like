import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike.Component {

  static methods = {
    test() {

    }
  }

  render() {
    return (<div class="root">
      <div aa$sync={this.aa}></div>
      {/* <div aa:dd$sync={this.aa}></div> */}
      <div onClick$stop={this.test}></div>
      <div onClick$prevent={this.test}></div>
      <div onClick$capture={this.test}></div>
      <div onClick$self={this.test}></div>
      <div onClick$native={this.test}></div>
      <div onClick$once={this.test}></div>
      <div onClick$left={this.test}></div>
      <div onClick$right={this.test}></div>
      <div onClick$middle={this.test}></div>
      <div onClick$passive={this.test}></div>
      <div onClick$enter={this.test}></div>
      <div onClick$13={this.test}></div>
    </div>);
  }

}

export default App;

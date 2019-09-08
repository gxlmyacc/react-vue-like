import React from 'react';
import router from 'router';
import ReactVueLike from 'react-vue-like';
import { RouterView } from 'react-view-router';
import AppHeader from './app-header';

class App extends ReactVueLike {

  static methods = {
    updateRef(el) {
      console.log('App.updateRef', el);
    }
  }

  render() {
    return (<div>
      <h1>App</h1>
      <AppHeader className="app-header" ref={this.updateRef} />
      <RouterView test="haha" className="app-client" router={router} />
    </div>);
  }

}

export default App;

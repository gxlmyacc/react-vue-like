import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike {


  render() {
    return (<div class="root" v-observer>
      <div v-observer$render>
         dddd
      </div>
    </div>);
  }

}

export default App;

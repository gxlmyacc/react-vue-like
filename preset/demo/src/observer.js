import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike.Component {


  render() {
    let aa;
    return (<div class="root" v-observer>
      <div v-observer$render>
         dddd
      </div>
      <div v-observer={() => {
       aa = 1;
      }}>
         aaaa
      </div>
    </div>);
  }

}

export default App;

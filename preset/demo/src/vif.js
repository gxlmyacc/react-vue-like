import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike {

  static data() {
    return {
      vif: true,
    };
  }

  render() {
    return (<div class="root">
      <>
       <span>aaa</span>
      </>
      <template v-if={this.vif}>
        <span>span</span>
        <span>span2</span>
        {
          [
            <span>3</span>,
            <span>3</span>
          ]
        }
      </template>
      <span v-if={this.vif}>v-if showing</span>
    </div>);
  }

}

export default App;

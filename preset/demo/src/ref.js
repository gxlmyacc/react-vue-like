import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike.Component {

  static data() {
    return {
      list: [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]
    }
  }

  render() {
    return (<div class="root" ref="container">
      {
        this.list.map(v => {
          return [
            <span ref="item1" key={v.key}>{v.value}</span>,
            // <span ref:key="item2" key={v.key}>{v.value}</span>,
            <span ref$key="item2" key={v.key}>{v.value}</span>,
          ]
        })
      }

    </div>);
  }

}

export default App;

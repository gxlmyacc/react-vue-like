import React from 'react';

class App extends ReactVueLike.Component {

  static inheritAttrs = true;

  static data() {
    return {
      header: true,
      body: true,
      footer: true
    };
  }

  static methods = {

  }

  render() {
    let a = [1, 2, 3];
    console.log(a);
    return <div>
      <slot className="11" v-if={this.header}>
        ddd
        <div>slot text</div>
      </slot>
      <SomeComp>
        <div slot="header">
        </div>
        <template v-if={this.body} slot="body">
          { ({ item }) => <div name={item.name}></div> }
        </template>
        <div v-if={this.footer} slot="footer">
        </div>
      </SomeComp>
    </div>
  }

}

export default App;

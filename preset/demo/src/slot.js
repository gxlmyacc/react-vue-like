import React from 'react';

class App extends ReactVueLike {

  static inheritAttrs = true;

  static data() {
    return {

    };
  }

  static methods = {

  }

  render() {
    let a = [1, 2, 3];
    console.log(a);
    return <div>
      <slot>
        ddd
        <div>slot</div>
      </slot>
      <SomeComp>
        <div slot="header">
        </div>
        <template slot="body">
          { ({ item }) => <div name={item.name}></div> }
        </template>
        <div slot="footer">
        </div>
      </SomeComp>
    </div>
  }

}

export default App;

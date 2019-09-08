import React from 'react';

class App extends ReactVueLike {


  static data() {
    return {

    };
  }


  render() {
    return (<div class="root">
      <span> dd { dd | dd } dd </span>
      <span a={ 11 | cc }>
        aa
        { 2 | 'aa.bb.cc'(123, 333) }
        bb
        {11 | dd.cc.ee  }
        { 22 | aa.bb.cc.dd(11) }
        { 33 | bb(bb) }
        bb
        { 44 | dd }
      </span>
    </div>);
  }

}

export default App;

import React from 'react';

class App extends ReactVueLike {

  render() {
    return (<div class="root" {...props1}>
      <span v-test_dd$aa$bb={[1,'2',true, null, undefined,
        new Date(1, a), new RegExp(), /dd/i, this.vif, {}, [],
        fun(), (function func1(aa = {}, { dd: cc }, [ dd = 1 ]){ let ee = 1, rr; }), ...ddd,
        a > c ? (b - 1) : (c + 1 ? (c || d ? e ^ d : 11) : true),
        !d, i++, --i,
        { [dd]: 1, cc: 2, get ee(){}, set ee(v){}, rr(){} },
        `11${1}22${3}44`
      ]}>
      </span>
      <Test dd="1" />
      <Test2 v-test2={{ aa: 1 }} />
    </div>);
  }

}

export default App;

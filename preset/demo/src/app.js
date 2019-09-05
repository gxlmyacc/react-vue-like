import React from 'react';
import dd, {aa} from 'cc';
import ReactVueLike from 'react-vue-like';

import 'some.scss?scoped';

function Test() {
  return <div></div>;
}

function Test2() {
  return <div></div>;
}

var __dirname = '1';

class App extends ReactVueLike {

  static data() {
    return {
      __dirname,
      dirname: a.__dirname,
      filename: __filename,
      now: __now,
      vif: true,
      vshow: true,
      formData: {
        text: 'aaa'
      },
      languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Scala']
    };
  }

  render() {
    // let lan;
    return (<div class="root">
      <span ref="ddd" className="dddd" v-if={this.vif}>v-if showing</span>
      <span ref="bbb" key="ccc" className={'aa' + ' bb'} v-show={this.vif && this.vshow} style={{ display: 'none' }}>v-show showing</span>
      <input className={callFunc()} v-model={this.formData.text} />
      <input v-model={this.formData.text1} onChange={a => console.log(a)} />
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
      <span> dd { dd | dd } dd </span>
      <span a={ 11 | cc }> aa { 2 | 'aa.bb.cc'(123, 333) } bb {11 | dd.cc.ee  } { 22 | aa.bb.cc.dd(11) } { 33 | bb(bb) } bb { 44 | dd }</span>
    </div>);
  }

}

export default App;

import React from 'react';
import ReactVueLike from 'react-vue-like';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { AST_Accessor } from '_terser@4.2.1@terser';

function Test() {
  return <div></div>;
}

function Test2() {
  return <div></div>;
}

class App extends ReactVueLike {

  static data() {
    return {
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
      {/* <span v-if={this.vif}>v-if showing</span>
      <span v-show={this.vif && this.vshow} style={{ display: 'none' }}>v-show showing</span>
      <input v-model={this.formData.text} />
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
      <span> dd { dd | dd } dd </span>*/}
      <span a={ 11 | cc }> aa { 2 | 'aa.bb.cc'(123, 333) } bb {11 | dd.cc.ee  } { 22 | aa.bb.cc.dd(11) } { 33 | bb(bb) } bb { 44 | dd }</span>
    </div>);
  }

}

export default App;

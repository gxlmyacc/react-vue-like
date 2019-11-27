import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike {

  static data() {
    const namespace = __packagename.match(/\/?([0-9a-z-]+)$/)[1];
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
      namespace,
      languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Scala']
    };
  }

  render() {
    return (<div class="root">
      {/* <span ref="ddd" className="dddd" v-if={this.vif}>v-if showing</span>
      <span ref="bbb" key="ccc" className={'aa' + ' bb'} v-show={this.vif && this.vshow} style={{ display: 'none' }}>v-show showing</span>
      <input className={callFunc()} v-model={this.formData.text} />
      <input v-model={this.formData.text1} onChange={a => console.log(a)} /> */}
      <span className="app-window-icon" v-show={!this.isWindowMax} onClick={this.windowMax}>1</span>
      <span className="app-window-icon" v-show={this.isWindowMax} onClick={this.windowRestore}>2</span>
    </div>);
  }

}

export default App;

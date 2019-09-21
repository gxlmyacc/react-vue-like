import React from 'react';
import ReactVueLike from 'react-vue-like';

class App extends ReactVueLike {


  render() {
    return (<div class="root">
      <input add="" v-model={this.formData.text} />
      <input v-model$lazy={this.formData.text} />
      <input v-model$number$lazy={this.formData.text} />
      <input v-model$trim={this.formData.text1} onChange={a => console.log(a)} />
    </div>);
  }

}

export default App;

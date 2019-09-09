import React from 'react';

class App extends ReactVueLike {

  static data() {
    return {
    };
  }

  static methods = {
    dd() {
      return <div className="test"></div>
    }
  }

  cc() {
    return <div className="test"></div>;
  }

  render() {
    let a = true;
    // let ret = () => <div></div>;
    let ret = function() {
      return <div></div>;
    }
    if (a) {
      ret = () => {
        console.log('ddd');
        return <span></span>;
      }
    }
    // else ret = () => <p></p>;
    console.log('ddd', ret);
    return ret();

    // return this.cc();
    // return a && <div>dd</div>
  }

}

export default App;

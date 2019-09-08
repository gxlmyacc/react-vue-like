import React from 'react';
import ReactVueLike from './component';
import {
  handleError
} from './utils';

class ReactVueLikeDirective extends ReactVueLike {

  static props = {
    _source: {
      // type: [String, Object],
      required: true
    },
    _bindings: {
      type: Array,
      required: true
    }
  }

  static isAbstract = true;

  async _callDirective(eventName) {
    try {
      this.props._bindings.forEach(binding => {
        let d = this.$directives[binding.name];
        if (!d) throw new Error(`directive '${binding.name}' not be found!`);
        if (!d[eventName]) return;
        d[eventName].call(this.$parent, this.$el, binding, this._reactInternalFiber);
      });
    } catch (e) {
      handleError(e, this, `directive:${eventName}`);
      throw e;
    }
  }

  mounted() {
    this._callDirective('bind');
    this._callDirective('inserted');
  }

  beforeUpdate() {
    this._callDirective('update');
  }

  updated() {
    this._callDirective('componentUpdated');
  }

  beforeDestory() {
    this._callDirective('unbind');
  }

  render() {
    // eslint-disable-next-line
    const { _source, _bindings, ...props } = this.props;
    const Source = _source;
    return <Source {...props} />;
  }

}

export default ReactVueLikeDirective;

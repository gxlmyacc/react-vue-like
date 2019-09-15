import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { action } from './mobx';
import ReactVueLike from './component';
import config from './config';
import {
  iterativeParent
} from './utils';

class Directive extends React.Component {

  static propTypes = {
    _source: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.elementType.isRequired,
    ]),
    _bindings: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    iterativeParent(this, parent => this.$parent = parent, ReactVueLike);
    if (!this.$parent) throw new Error('[ReactVueLike error]: can not find directive parent component');

    const _pending = () => {
      this.$directives = this.$parent.$directives;

      this._call('bind');

      this._mountPending = () => {
        this._mountPending = null;
        this._call('insert');
      };
      this.setState({ isMounted: true });
    };

    if (this.$parent._isWillMount) _pending();
    else this.$parent._mountedPending.push(_pending);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this._mountPending) this._mountPending();
    else this._call('componentUpdated');
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this._call('update');
    return null;
  }

  componentWillUnmount() {
    this._call('unbind');
  }

  async _call(eventName) {
    const el = ReactDOM.findDOMNode(this);
    this.props._bindings.forEach(binding => {
      let d = this.$directives[binding.name];
      if (!d) throw new Error(`directive '${binding.name}' not be found!`);
      let event = d[eventName];
      if (!event) return;
      if (config.useAction) event = action(event);
      event.call(this.$parent, el, binding, this._reactInternalFiber);
    });
  }

  render() {
    if (!this.state.isMounted) return null;
    // eslint-disable-next-line
    const { _source, _bindings, children, ...props } = this.props;
    return React.createElement(_source, Object.assign(props, { ref: this.$ref }), children);
  }

}

export default Directive;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { action } from './mobx';
import config from './config';
import {
  VUELIKE_PREFIX,
  iterativeParent,
  isFunction,
  isObject,
  warn,
  innumerable
} from './utils';

class VuelikeDirective extends React.Component {

  static propTypes = {
    _source: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.elementType.isRequired,
    ]),
    _bindings: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
    };
  }

  componentDidMount() {
    const _pending = () => {
      this.$directives = this.$parent.$directives;

      this._call('bind');

      this._mountPending = () => {
        this._mountPending = null;
        setTimeout(() => this._call('inserted'), 0);
      };
      this.setState({ isMounted: true });
    };

    const { vuelike } = this.props;
    if (vuelike) {
      this.$directives = this.vuelike.directives;
      _pending();
      return;
    }
  
    iterativeParent(this, parent => this.$parent = parent, vm => vm.isVuelikeComponentInstance);
    if (!this.$parent) throw new Error('[Vuelike error]: can not find VuelikeDirective parent component');

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

  _updateRef(r) {
    let ref = this.props.$ref;
    if (ref) {
      if (isFunction(ref)) ref(r);
      else if (isObject(ref)) ref.current = r;
    }
  }

  _call(eventName) {
    const el = ReactDOM.findDOMNode(this);
    this.props._bindings.forEach(binding => {
      let d = this.$directives[binding.name];
      if (!d) {
        if (process.env.NODE_ENV !== 'production') {
          warn(`VuelikeDirective '${binding.name}' not be found!`);
        }
        return;
      }
      let event = d[eventName];
      if (!event) return;
      if (config.enforceActions) event = action(event);
      event.call(this.$parent, el, binding, this._reactInternalFiber);
    });
  }

  render() {
    if (!this.state.isMounted) return null;
    // eslint-disable-next-line
    const { _source, _bindings, children, ...props } = this.props;
    return React.createElement(_source, Object.assign(props, { ref: ref => this._updateRef(ref) }), children);
  }

}

innumerable(VuelikeDirective, `${VUELIKE_PREFIX}DirectiveClass`, true);

export default VuelikeDirective;

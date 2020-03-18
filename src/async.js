import React from 'react';
import PropTypes from 'prop-types';
import {
  // iterativeParent,
  appendProperty,
  isFunction
} from './utils';

function defaultInitial(instance) {
  const className = instance.props.className;
  return React.createElement('span', {
    className: `${className ? `${className} ` : ''}react-vue-like-async-placeholder`
  });
}

class ReactVueLikeAsync extends React.Component {

  static propTypes = {
    className: PropTypes.any,
    promise: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Promise)]).isRequired,
    initial: PropTypes.any,
    error: PropTypes.any,
    loading: PropTypes.any,
  }

  static defaultProps = {
    initial: defaultInitial
  }

  constructor(props) {
    super(props);
    this.mounted = false;
    this.counter = 0;
    this.state = {
      error: null,
      result: props.initial || null,
      pending: null,
      isResolved: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.promise) this.start();
  }

  componentDidUpdate(prevProps) {
    const { promise } = this.props;

    if (promise !== prevProps.promise) {
      return promise ? this.start() : null;
    }
    ['initial', 'error', 'loading'].some(key => {
      let current = this.props[key];
      if (prevProps[key] !== current && this.state.result === current) {
        this.setState({ result: current });
        return true;
      }
    });
  }

  start() {
    let { promise, initial, loading, error } = this.props;
    const counter = ++this.counter;
    const isCanceled = () => this.state.pending !== promise || !this.mounted || counter !== this.counter;

    this.setState({
      isResolved: false,
      pending: promise,
      result: loading || initial || null,
      error: null,
    });
    if (promise) {
      (isFunction(promise) ? promise : () => promise)(this).then(result => {
        if (isCanceled()) return;
        this.setState({ isResolved: true, result, pending: null });
      }).catch(ex => {
        if (isCanceled()) return;
        this.setState({ isResolved: true, error: ex, result: error || null, pending: null });
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let { result } = this.state;
    if (result && result.__esModule) result = result.default;
    if (isFunction(result)) result = result(this);
    return result;
  }

}

appendProperty(ReactVueLikeAsync, '__vuelikeAsyncClass', true);

export default ReactVueLikeAsync;

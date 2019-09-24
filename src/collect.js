
import React from 'react';
import config from './config';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;

class Collect {

  start() {
    this.elements = [];
  }

  end(root) {
    let elements = this.elements || [];
    this.elements = null;

    const getRoot = root => {
      if (!root) return root;
      if (Array.isArray(root)) return root.map(r => getRoot(r));
      if (root.__collect) root.__collect.isRoot = true;
      return root.__collect || root;
    };
    return { root: getRoot(root), elements };
  }

  push(fn, component, props, children) {
    props = props || {};
    const node = {
      __collect: { fn, /* cid: this.elements.length, */ component, props, children },

      $$typeof: REACT_ELEMENT_TYPE,
      props,
      ref: props.ref || null,
      key: props.key || null,
      type: component,
      _store: { validated: Boolean(component) && (typeof component === 'string' || component.prototype instanceof React.Component) }
    };
    this.elements.push(node);
    return node;
  }

  render(elements, each) {
    elements && elements.forEach(node => {
      const el = node.__collect;
      delete node.__collect;

      each && each(el.component, el.props, el.children, Boolean(el.isRoot));

      let ret = el.fn.call(React, el.component, el.props, ...el.children);
      if (ret) Object.defineProperties(node, Object.getOwnPropertyDescriptors(ret));
    });
  }

  wrap(fn, each, pre, after) {
    if (!fn || !config.useCollect) return fn;
    let collect = this;
    return function render() {
      collect.start();

      let result = fn.apply(this, arguments);
      let { root, elements } = collect.end(result);

      pre && pre(root);

      collect.render(elements, each);

      after && after(result);

      return result;
    };
  }

}


export default new Collect();


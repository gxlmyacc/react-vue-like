
import React from 'react';
import config from './config';

const ForwardRefMeth = React.forwardRef(() => null);
export const REACT_FORWARD_REF_TYPE = ForwardRefMeth.$$typeof;

class Collect {

  start() {
    this.elements = [];
  }

  end(root) {
    let elements = this.elements;
    this.elements = null;

    const getRoot = root => {
      if (!root) return root;
      if (Array.isArray(root)) return root.map(r => getRoot(r));
      if (root.__collect) root.__collect.isRoot = true;
      return root.__collect || root;
    };
    return { root: getRoot(root), elements };
  }

  push(component, props, children) {
    const node = {
      __collect: { cid: this.elements.length, component, props, children },
    };
    this.elements.push(node);
    return node;
  }

  render(elements, each) {
    elements.forEach(node => {
      const el = node.__collect;
      delete node.__collect;

      const props = el.props || {};
      each && each(el.component, props, el.children, Boolean(el.isRoot));

      Object.assign(node, React.createElement(el.component, props, ...el.children));
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


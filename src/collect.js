
import React from 'react';

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
      return root.__collect || root;
    };
    return { root: getRoot(root), result: root, elements };
  }

  push(component, props, children) {
    const node = { __collect: { cid: this.elements.length, component, props, children } };
    this.elements.push(node);
    return node;
  }

  render(root, elements, each) {
    const na = !Array.isArray(root);
    elements.forEach(node => {
      const el = node.__collect;
      delete node.__collect;

      const props = el.props || {};
      each && each(el.component, props, el.children, root && (na ? root === el : root.includes(el)));

      Object.assign(node, React.createElement(el.component, props, ...el.children));
    });
  }

  wrap(fn, each, after) {
    if (!fn) return fn;
    let collect = this;
    return function render() {
      collect.start();

      let result = fn.apply(this, arguments);
      let { root, elements } = collect.end(result);

      collect.render(root, elements, each);

      after && after(result);

      return result;
    };
  }

}

export default new Collect();


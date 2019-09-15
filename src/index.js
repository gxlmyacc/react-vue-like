import React from 'react';
import { observable, flow, action } from './mobx';
import ReactVueLike from './component';
import Directive from './directive';
import Mixin from './mixin';
import Store from './store';
import before from './before';

export * from './utils';

ReactVueLike.Store = Store;
ReactVueLike.Mixin = Mixin;
ReactVueLike.observable = observable;
ReactVueLike.flow = flow;
ReactVueLike.action = action;

export {
  Directive as ReactVueLikeDirective
};

function ReactHook() {
  const _createElement = React.createElement;
  React.createElement = function createElement(Component, props, ...children) {
    const $component = props && props.$component;
    if ($component) {
      Component = $component;
      delete props.$component;
    }

    if (!Component) return _createElement.call(this, Component, props, ...children);

    Component = before(Component, props);

    let newComponent;
    if (Component.beforeConstructor) {
      newComponent = Component.beforeConstructor(props, ...children);
    }
    return _createElement.call(this, newComponent || Component, props, ...children);
  };
}

ReactHook();

export default ReactVueLike;

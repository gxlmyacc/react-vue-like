import React from 'react';
import before from './before';
import collect from './collect';

function ReactHook() {
  const _createElement = React.createElement;
  const _cloneElement = React.cloneElement;

  function createElement(Component, props, ...children) {
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
      if (newComponent !== undefined) Component = newComponent;
    }

    const $slotFn = props && props.$slotFn;
    if ($slotFn) return $slotFn(props || {}, children);

    if (Component === 'template') Component = React.Fragment;

    if (collect.elements) return collect.push(_createElement, Component, props, children);

    return _createElement.call(this, Component, props, ...children);
  }

  function cloneElement(element, props, ...children) {
    if (collect.elements) return collect.push(_cloneElement, element, props, children);
    return _cloneElement.call(this, element, props, ...children);
  }

  React.createElement = createElement;
  React.cloneElement = cloneElement;
}

export default ReactHook;

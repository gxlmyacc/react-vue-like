import React from 'react';
import before from './before';
import collect from './collect';
import ReactVueLike from './component';
import Async from './async';

function ReactHook() {
  if (React._vueLike) {
    if (React._vueLike.build && React._vueLike.build >= ReactVueLike.build) return;
  }

  const _createElement = React.createElement;
  const _cloneElement = React.cloneElement;

  function createElement(Component, props, ...children) {
    const $component = props && props.$component;
    if ($component) {
      Component = $component;
      delete props.$component;
    }

    if (!Component) return _createElement.call(this, Component, props, ...children);

    children.forEach((c, i) => {
      if (c instanceof Promise) children[i] = _createElement.call(this, Async, { promise: c });
    });

    Component = before(Component, props);

    let newComponent;
    if (Component.beforeConstructor) {
      newComponent = Component.beforeConstructor(props, ...children);
      if (newComponent !== undefined) Component = newComponent;
    }

    const $slotFn = props && props.$slotFn;
    if ($slotFn) return $slotFn(props || {}, children);

    if (Component === 'template') Component = React.Fragment;
    else if (Component === 'async') Component = Async;

    if (collect.elements) return collect.push(_createElement, Component, props, children);
    return _createElement.call(this, Component, props, ...children);
  }

  function cloneElement(element, props, ...children) {
    if (collect.elements) return collect.push(_cloneElement, element, props, children);
    return _cloneElement.call(this, element, props, ...children);
  }

  React.createElement = createElement;
  React.cloneElement = cloneElement;

  const _forceUpdate = React.Component.prototype.forceUpdate;
  function forceUpdate() {
    if (this && this._isVueLike && this._checkActive) {
      return this._checkActive(_forceUpdate, arguments);
    }
    return _forceUpdate.apply(this, arguments);
  }
  forceUpdate._isVueLike = true;
  if (!React.Component.prototype.forceUpdate._isVueLike) React.Component.prototype.forceUpdate = forceUpdate;

  Object.defineProperty(React, '_vueLike', { writable: true, configurable: true, value: ReactVueLike });
}

export default ReactHook;

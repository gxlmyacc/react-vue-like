import React from 'react';
import { Observer, innumerable, isVueLikeComponent } from './utils';
import collect from './collect';
import ReactVueLike from './component';
import Async from './async';
import beforeClass from './before-class';

function removePropSolts(props) {
  if (props && props.$slots) {
    Object.assign(props, props.$slots);
    delete props.$slots;
  }
}

const _createElement = React.createElement;
const _cloneElement = React.cloneElement;
const _forceUpdate = React.Component.prototype.forceUpdate;

const builtInTags = {
  template: React.Fragment,
  async: Async,
  observer: Observer
};

const createElement = function (Component, props, ...children) {
  if (collect.elements) return collect.push(_createElement, Component, props, children);
  return _createElement.call(this, Component, props, ...children);
};

function createElementHook(Component, props, ...children) {
  const $component = props && props.$component;
  if ($component) {
    Component = $component;
    delete props.$component;
  }

  if (!Component) return _createElement.call(this, Component, props, ...children);

  children.forEach((c, i) => {
    if (c instanceof Promise) children[i] = createElement.call(this, Async, { promise: c });
  });

  if (typeof Component === 'string') {
    let newComponent = builtInTags[Component];
    if (newComponent !== undefined) Component = newComponent;
  }
  
  if (Component.vuelikeConstructor) {
    let newComponent = Component.vuelikeConstructor(Component, props || {}, children, React);
    if (newComponent !== undefined) Component = newComponent;
  }

  const $slotFn = props && props.$slotFn;
  if ($slotFn) return $slotFn(props || {}, children);

  if (!isVueLikeComponent(Component)) removePropSolts(props);

  beforeClass(props);

  return createElement.call(this, Component, props, ...children);
}

function cloneElementHook(element, props, ...children) {
  if (collect.elements) return collect.push(_cloneElement, element, props, children);
  return _cloneElement.call(this, element, props, ...children);
}


function forceUpdateHook() {
  if (this && this._isVueLike && this._checkActive) {
    return this._checkActive(_forceUpdate, arguments);
  }
  return _forceUpdate.apply(this, arguments);
}
innumerable(forceUpdateHook, '_isVueLike', true);


function ReactHook() {
  if (React._vueLike) {
    if (React._vueLike.build && React._vueLike.build >= ReactVueLike.build) return;
  }

  React.createElement = createElementHook;
  React.cloneElement = cloneElementHook;

  if (!React.Component.prototype.forceUpdate._isVueLike) {
    React.Component.prototype.forceUpdate = forceUpdateHook;
  }

  innumerable(React, '_vueLike', ReactVueLike);
}

ReactHook.createElement = createElementHook;
ReactHook.cloneElement = cloneElementHook;

export default ReactHook;

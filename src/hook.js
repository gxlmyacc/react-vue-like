import React from 'react';
import { Observer, innumerable } from './utils';
import collect from './collect';
import ReactVueLike from './vuelike';
import Async from './async';
import { fallbackConstructor, otherConstructor } from './constructor';

const _createElement = React.createElement;
const _cloneElement = React.cloneElement;
const _forceUpdate = React.Component.prototype.forceUpdate;

const builtInTags = {
  template: React.Fragment,
  async: Async,
  observer: Observer,
};

const createElement = function (Component, props, ...children) {
  if (collect.elements) return collect.push(_createElement, Component, props, children);
  return _createElement.call(this, Component, props, ...children);
};

function createElementHook(Component, props, ...children) {
  // const $component = props && props.$component;
  // if ($component) {
  //   Component = $component;
  //   delete props.$component;
  // }

  if (!Component) return _createElement.call(this, Component, props, ...children);

  children.forEach((c, i) => {
    if (c instanceof Promise) children[i] = createElement.call(this, Async, { promise: c });
  });

  let builtIn;
  if (typeof Component === 'string') {
    let builtIn = builtInTags[Component];
    if (builtIn !== undefined) Component = builtIn;
  }
  
  let isVuelike = false;
  if (Component.vuelikeConstructor) {
    isVuelike = true;
    let newComponent = Component.vuelikeConstructor(Component, props || {}, children, React);
    if (newComponent !== undefined) Component = newComponent;
  }

  if (Component.beforeConstructor) {
    let newComponent = Component.beforeConstructor(Component, props || {}, children, React);
    if (newComponent !== undefined) Component = newComponent;
  }

  if (!builtIn && !isVuelike) otherConstructor(props, children, React);

  fallbackConstructor(props, children, React);

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

import React from 'react';
import { innumerable, VUELIKE_PREFIX } from './utils';
// import collect from './collect';
import Vuelike from './vuelike';
import Async from './async';
import VuelikeObserver from './observer';

const _createElement = React.createElement;
const _forceUpdate = React.Component.prototype.forceUpdate;

const builtInTags = {
  template: React.Fragment,
  async: Async,
  observer: VuelikeObserver,
};

function createElementHook(Component, props, ...children) {
  if (!Component) return _createElement.call(this, Component, props, ...children);

  children.forEach((c, i) => {
    if (c instanceof Promise) children[i] = _createElement.call(this, Async, { promise: c });
  });

  if (typeof Component === 'string') {
    let builtIn = builtInTags[Component];
    if (builtIn !== undefined) Component = builtIn;
  }

  if (!props) props = {};

  if (Component.vuelikeConstructor) {
    let newComponent = Component.vuelikeConstructor(Component, props, children, React);
    if (newComponent !== undefined) Component = newComponent;
  }

  if (Component.beforeConstructor) {
    let newComponent = Component.beforeConstructor(Component, props, children, React);
    if (newComponent !== undefined) Component = newComponent;
  }

  return _createElement.call(this, Component, props, ...children);
}

function forceUpdateHook() {
  if (this && this.isVuelikeComponentInstance && this._checkActive) {
    return this._checkActive(_forceUpdate, arguments);
  }
  return _forceUpdate.apply(this, arguments);
}
innumerable(forceUpdateHook, VUELIKE_PREFIX, true);


function ReactHook() {
  if (React[VUELIKE_PREFIX]) {
    if (React[VUELIKE_PREFIX].build && React[VUELIKE_PREFIX].build >= Vuelike.build) return;
  }

  React.createElement = createElementHook;

  if (!React.Component.prototype.forceUpdate[VUELIKE_PREFIX]) {
    React.Component.prototype.forceUpdate = forceUpdateHook;
  }

  innumerable(React, VUELIKE_PREFIX, Vuelike);
}

ReactHook.createElement = createElementHook;

export default ReactHook;

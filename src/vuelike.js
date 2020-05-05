import { configure } from 'mobx';
import config from './config';
import {
  mergeObject, isFunction, isPlainObject, camelize
} from './utils';


function normalizeComponentNames(comps, prefix, parentKey = '') {
  const COMP_REGX = /^[A-Z][A-Za-z]+/;
  let ret = {};
  Object.keys(comps).forEach(key => {
    if (!COMP_REGX.test(key)) return;
    const comp = comps[key];
    if (!comp) {
      console.warn(`component [${key}] is not exist!`);
      return;
    }
    ret[`${prefix}${parentKey}${key}`] = comp;
    Object.assign(ret, normalizeComponentNames(comp, prefix, `${parentKey}${key}`));
  });
  return ret;
}

class PluginArray extends Array {

  get(name) {
    let p = this.find(p => p.name === name);
    return p ? p.plugin : null;
  }

}

class ReactVueLike {

  constructor(options = {}) {
    this.isVueLike = true;
    this.options = options;
    this.plugins = new PluginArray();
    this.mixins = [];
    this.components = {};
    this.filters = {};
    this.directives = {};
    this.hocs = [];
    this.events = { components: {}, app: {} };
    this.inherits = {};
    this.config = { ...config };
  }

  configure(options = {}) {
    mergeObject(this.config, options);
    if (this.config.enforceActions !== undefined) {
      configure({ enforceActions: config.enforceActions ? 'observed' : 'never' });
    }
  }

  use(plugin, options = {}) {
    if (!plugin) return;
    // if (!plugin.name) throw new Error('[ReactVueLike.use]plugin \'name\' can not be empty!');

    let install = isFunction(plugin)
      ? plugin
      : plugin.install
        ? plugin.install.bind(plugin)
        : null;
    if (!install) throw Error('[ReactVueLike.use]plugin need has \'install\' method!');

    let ret = install(this, options);

    let afterInstall = () => {
      this.plugins.push({ name: plugin.name, plugin, options });
      return () => {
        let ret;
        let idx = this.plugins.find(p => p.plugin === plugin);
        if (~idx) ret = this.plugins.splice(idx, 1);
        return ret;
      };
    };

    return ret instanceof Promise ? ret.then(() => afterInstall())  : afterInstall();
  }

  mixin(mixin) {
    if (!mixin) return;
    this.mixins.push(mixin);
    return function () {
      let ret;
      let idx = this.mixins.find(v => v === mixin);
      if (~idx) ret = this.plugins.splice(idx, 1);
      return ret;
    };
  }

  component(keyOrComponents, componentOrPrefix = '') {
    if (isPlainObject(keyOrComponents)) {
      Object.assign(this.components, normalizeComponentNames(keyOrComponents, componentOrPrefix));
      return keyOrComponents;
    }
    return this.components[keyOrComponents] = componentOrPrefix;
  }

  filter(keyOrFilters, filter) {
    if (isPlainObject(keyOrFilters)) {
      mergeObject(this.filters, keyOrFilters);
      return keyOrFilters;
    }
    return this.filters[keyOrFilters] = filter;
  }

  directive(keyOrDirectives, directive) {
    if (isPlainObject(keyOrDirectives)) {
      Object.assign(this.directives, keyOrDirectives);
      return keyOrDirectives;
    }
    return this.directives[keyOrDirectives] = directive;
  }

  _off(name, listener, events) {
    if (!name) throw new Error('[ReactVueLike]on name can not be empty!');
    let listeners = events[name];
    if (!listeners) return; 

    let old;
    if (!listener) {
      old = events[name];
      events[name] = [];
      return old;
    }

    const idx = listeners.findIndex(v => v === listener);
    if (~idx) old = listeners.splice(idx, 1);
    return old;
  }

  on(name, listener, isComponent) {
    if (!name) throw new Error('[ReactVueLike]on name can not be empty!');
    if (!listener) throw new Error('[ReactVueLike]on listener can not be null!');
    name = camelize(name);
    let events = isComponent ? this.events.components : this.events.app;
    let listeners = events[name];
    if (!listeners) events[name] = listeners = []; 
    const v = listeners.find(v => v === listener);
    if (!v) listeners.push(listener);
    return () => this._off(name, listener, events);
  }

  off(name, listener, isComponent) {
    name = camelize(name);
    let events = isComponent ? this.events.components : this.events.app;
    return this._off(name, listener, events);
  }

  inherit(keyOrInherits, value) {
    if (!keyOrInherits) return;
    if (isPlainObject(keyOrInherits)) {
      Object.assign(this.inherits, keyOrInherits);
      return keyOrInherits;
    }
    return this.inherits[keyOrInherits] = value;
  }

}


export default ReactVueLike;
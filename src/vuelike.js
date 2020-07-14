import { configure, action } from 'mobx';
import config from './config';
import {
  mergeObject, isFunction, isPlainObject, camelize, VUELIKE_PREFIX, VUELIKE_CLASS,
  isReactComponent, warn, observer, innumerable, isProduction, handleError,
  isVuelikeComponent, isFunctionComponent, isForwardComponent, replaceMethods,
  isVuelikeComponentClass 
} from './utils';

const LIFECYCLE_HOOKS = [
  'componentWillMount',
  'componentDidMount',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentDidActivate',
  'componentWillUnactivate',
  'componentWillUnmount',
  'componentDidCatch',
];

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

function withVuelike(vuelike, component, options = {}) {
  if (component[`${VUELIKE_PREFIX}Hoc`] === true) {
    warn(
      "[withVuelike]You are trying to use 'withVuelike' on a component that already has 'withVuelike'"
    );
    return component;
  }
  
  const isVuelikeClasses = isVuelikeComponent(component);
  if (!isVuelikeClasses) {
    let originComponent = component;
    if (isReactComponent(component)) {
      innumerable(component, 'beforeConstructor', function (target, props, children) {
        Object.assign(props, { $vuelike: vuelike }, vuelike.inherits);
        const originMethods = replaceMethods(target.prototype, LIFECYCLE_HOOKS.reduce((p, key) => {
          p[key] = function () {
            let handlers = vuelike.listeners.component[key] || [];
            if (originComponent.isRoot) handlers = handlers.concat(vuelike.listeners.app[key] || []);
            let sr = vuelike._call(key, handlers, arguments);
            let tr = originMethods[key] && originMethods[key](arguments.concat(sr));
            return tr === undefined ? sr : tr;
          };
        }, {}), 'UNSAFE_');
      });
    } else if (isFunctionComponent(component)) {
      component = function VuelikeFunctionWrapper(props) {
        innumerable(props, '$vuelike', vuelike);
        Object.keys(vuelike.inherits).forEach(key => innumerable(props, key, vuelike.inherits[key]));
        return originComponent(props);
      };
    } else if (isForwardComponent(component)) {
      const originRender = originComponent.render;
      originComponent.render = function (props) {
        innumerable(props, '$vuelike', vuelike);
        Object.keys(vuelike.inherits).forEach(key => innumerable(props, key, vuelike.inherits[key]));
        return originRender.call(vuelike, props);
      };
    }
    component = observer(component);
  }
  // if (!isReactComponent(component)) {
  //   if (!component.vuelikeConstructor) {
  //     // eslint-disable-next-line no-proto
  //     const oldConstructor = component.__proto__;
  //     const VuelikeWrapper = function (props) {
  //       oldConstructor.apply(vuelike, arguments);
  //       vuelike._createInstance(props, component);
  //     };
  //     // VuelikeWrapper.prototype = Object.assign(target.prototype, {
  //     //   constructor: VuelikeWrapper
  //     // });
  //     component.prototype.prototype = VuelikeComponent.prototype;
  //     // eslint-disable-next-line no-proto
  //     component.__proto__ = VuelikeWrapper;
  
  //     innumerable(component, 'vuelikeConstructor', function (target, props, children) {
  //       return vuelikeConstructor(component, props, children);
  //     });
  //   }
  // } else {
  //   component = observer(component);
  // }

  const walkHocs = component => {
    vuelike.hocs.forEach(hoc => {
      const newComponent = hoc(component, options);
      if (newComponent !== undefined) {
        component = newComponent;
      }
    });
    vuelike.plugins.forEach(({ pluginName, plugin }) => {
      if (!plugin.hoc) return;
      const newComponent = plugin.hoc(component, pluginName ? (options[pluginName] || {}) : options);
      if (newComponent !== undefined) {
        component = newComponent;
      }
    });
    return component;
  };

  component = walkHocs(component);

  innumerable(component, `${VUELIKE_PREFIX}Hoc`, true);

  return component;
}

class Vuelike {

  constructor(options = {}) {
    this.isVuelikeInstance = true;
    this.options = options;
    this.plugins = [];
    this.mixins = [];
    this.components = {};
    this.filters = {};
    this.directives = {};
    this.hocs = [];
    this.events = { component: {}, app: {} };
    this.inherits = {};
    this.config =  mergeObject({ keyCodes: {}, optionMergeStrategies: {} }, config);

    innumerable(this, 'withVuelike', (component, options = {}) => withVuelike(this, component, options));
  }

  getPlugin(name) {
    let p = this.plugins.find(p => {
      const pluginName = p.pluginName || p.name;
      return pluginName === name;
    });
    return p ? p.plugin : null;
  }

  configure(options = {}) {
    mergeObject(this.config, options);
    if (this.config.enforceActions !== undefined) {
      configure({ enforceActions: this.config.enforceActions ? 'observed' : 'never' });
    }
  }

  use(plugin, options = {}) {
    if (!plugin) return;
    // if (!plugin.name) throw new Error('[Vuelike.use]plugin \'name\' can not be empty!');

    const pluginName = plugin.pluginName || plugin.name;

    let install = isFunction(plugin)
      ? plugin
      : plugin.install
        ? plugin.install.bind(plugin)
        : null;
    if (!install) throw Error(`[Vuelike.use]plugin ${pluginName ? `'${pluginName}'` : ''} need has 'install' method!`);

    if (pluginName && this.getPlugin(pluginName)) {
      console.warn(`[Vuelike.use]plugin ${pluginName} aleady be used!`);
      return;
    }

    let ret = install(this, options);

    let afterInstall = () => {
      this.plugins.push({ name: pluginName, plugin, options });
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
      if (~idx) ret = this.mixins.splice(idx, 1);
      return ret;
    };
  }

  hoc(hoc) {
    if (!hoc) return;
    this.hocs.push(hoc);
    return function () {
      let ret;
      let idx = this.hocs.find(v => v === hoc);
      if (~idx) ret = this.hocs.splice(idx, 1);
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
    if (!name) throw new Error('[Vuelike]on name can not be empty!');
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
    if (!name) throw new Error('[Vuelike]on name can not be empty!');
    if (!listener) throw new Error('[Vuelike]on listener can not be null!');
    name = camelize(name);
    let events = isComponent ? this.events.component : this.events.app;
    let listeners = events[name];
    if (!listeners) events[name] = listeners = []; 
    const v = listeners.find(v => v === listener);
    if (!v) listeners.push(listener);
    return () => this._off(name, listener, events);
  }

  off(name, listener, isComponent) {
    name = camelize(name);
    let events = isComponent ? this.events.component : this.events.app;
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

  createApp(App, options = {}) {
    let target = App;
    if (isForwardComponent(target) && target.__component) target = target.__component;
    if (isVuelikeComponentClass(target)) {
      if (target.isRoot && typeof target.isRoot === 'boolean' && !target.vuelike) {
        target.vuelike = this;
      }
    }
    return App;
  }

  _call(eventName, handlers, args) {
    try {
      if (!handlers) return;
      if (isFunction(handlers)) return handlers.call(this, ...args);
      let ret;
      for (let handler of handlers) {
        ret = handler.apply(this, args.concat(ret));
      }
    
      return ret;
    } catch (e) {
      handleError(e, this, `_call:${eventName}`);
      throw e;
    }
  }

  _resolveComp(compName) {
    let comp = this.components[compName];
    if (!isProduction && !comp) warn(`can not resolve component '${compName}'!`, this);
    return comp || compName;
  }

  _resolveAction(handler) {
    if (!handler) return handler;
    return action(handler);
  }

  _resolveFilter(filter, filterName) {
    if (!this.filters) return '';
    try {
      return filter();
    } catch (e) {
      handleError(e, this, `filter:${filterName}`);
      return '';
    }
  }

}

innumerable(Vuelike, VUELIKE_CLASS, true);

const ALIAS_METHODS = {
  _resolveComp: '_c',
  _resolveAction: '_a',
  _resolveFilter: '_f',
};
Object.keys(ALIAS_METHODS).forEach(key => innumerable(
  Vuelike.prototype, 
  ALIAS_METHODS[key], 
  Vuelike.prototype[key]
));

export default Vuelike;
import { observable, extendObservable, when, set, remove, action } from './mobx';
import { defComputed } from './utils';
import config from './config';

function wrapModuleState(module) {
  let ret = {};
  if (!module._state) return ret;

  Object.keys(module._state).forEach(key => {
    let set = v => {
      if (module.strict && !module._commiting) {
        throw new Error(`ReactVueLike.Store error: ''${key}' state can only be modified in mutation!`);
      }
      module._state[key] = v;
    };
    if (config.enforceActions) set = action(set);
    defComputed(
      ret,
      key,
      () => module._state[key],
      set
    );
  });
  return ret;
}

class Store {

  constructor(module = {}, parent, root, moduleName) {
    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.actionListeners = [];
    this.moduleName = moduleName || '';
    this.namespaced = module.namespaced || false;
    this.strict = Boolean(module.strict);

    this._commiting = false;
    this._state = observable.object(module.state || {});
    this.state = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this.modules = {};
    this.plugins = module.plugins || [];

    const _getters = {};
    if (module.getters) {
      Object.keys(module.getters).forEach(key => defComputed(_getters, key, () => {
        let get = module.getters[key];
        return get(this.state, this.getters, this.root.state, this.root.getters);
      }));
    }


    this.state = observable.object(wrapModuleState(this));
    this.getters = observable.object(_getters);

    let _mutations = module.mutations || {};
    this.mutations = {};
    Object.keys(_mutations).forEach(key => this.mutations[key] = action(key, _mutations[key]));

    this.actions = module.actions ? { ...module.actions } : {};


    if (this.parent && moduleName) {
      this._mergeState(this.moduleName, this.state);
      this._mergeGetters(this.moduleName, _getters);
      this._mergeMutations(this.moduleName, this.mutations);
      this._mergeActions(this.moduleName, this.actions);
    }

    if (module.modules) {
      Object.keys(module.modules).forEach(moduleName => this.registerModule(moduleName, module.modules[moduleName]));
    }

    if (module.install) this.install = module.install.bind(this);

    if (this.plugins) this.plugins.forEach(p => p(this));
  }

  _getModuleKey(moduleName, key) {
    return this.namespaced ? `${moduleName}/${key}` : key;
  }

  _mergeState(moduleName, state) {
    set(this.state, moduleName, state);
  }

  _mergeGetters(moduleName, getters) {
    const newGetters = {};
    const keys = Object.keys(getters);
    if (!keys.length) return;
    keys.forEach(key => {
      const d = Object.getOwnPropertyDescriptor(getters, key);
      if (!d) return;
      defComputed(newGetters, this._getModuleKey(moduleName, key), d.get, d.set);
    });
    extendObservable(this.getters, newGetters);
    if (this.parent) this.parent._mergeGetters(this.moduleName, getters);
  }

  _mergeMutations(moduleName, mutations) {
    const newMutations = {};
    const keys = Object.keys(newMutations);
    if (!keys.length) return;
    keys.forEach(key => newMutations[this._getModuleKey(moduleName, key)] = mutations[key]);
    Object.assign(this.mutations, newMutations);
    if (this.parent) this.parent._mergeMutations(this.moduleName, mutations);
  }

  _mergeActions(moduleName, actions) {
    const newAtions = {};
    const keys = Object.keys(newAtions);
    if (!keys.length) return;
    keys.forEach(key => newAtions[this._getModuleKey(moduleName, key)] = actions[key]);
    Object.assign(this.actions, newAtions);
    if (this.parent) this.parent._mergeActions(this.moduleName, actions);
  }

  _removeState(key) {
    remove(this.state, key);
  }

  _removeGetter(key) {
    remove(this.getters, key);
    if (this.parent) this.parent._removeGetter(this.parent._getModuleKey(this.moduleName, key));
  }

  _removeMutation(key) {
    delete this.mutations[key];
    if (this.parent) this.parent._removeMutation(this.parent._getModuleKey(this.moduleName, key));
  }

  _removeAction(key) {
    delete this.actions[key];
    if (this.parent) this.parent._removeAction(this.parent._getModuleKey(this.moduleName, key));
  }

  replaceState(state = {}) {
    const _state = { ...state };
    Object.keys(this.modules).forEach(moduleName => _state[moduleName] = this.modules[moduleName].state || {});
    this._state = observable.object(_state);
    this.state = observable.object(wrapModuleState(this));
  }

  registerModule(moduleName, module) {
    if (!moduleName) return;
    if (this.modules[moduleName]) this.unregisterModule(moduleName);
    if (!module) return;
    this.modules[moduleName] = new Store(module, this, this.root, moduleName);
  }

  unregisterModule(moduleName) {
    const module = this.modules[moduleName];
    if (!module) return;

    this._removeState(moduleName);
    Object.keys(this.getters).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeGetter(key);
    });
    Object.keys(this.mutations).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeMutation(key);
    });
    Object.keys(this.actions).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeAction(key);
    });

    this.modules[moduleName] = null;
  }

  watch(fn, callback) {
    let oldValue;
    return when(() => oldValue !== fn(), callback);
  }

  commit(event, payload) {
    if (!event) return;

    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';
    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) throw new Error(`commit error: module '${moduleName}' not be found!`);
      ret = module.commit(eventName, payload);
    } else {
      const mutation = this.mutations[event];
      if (!mutation) throw new Error(`commit error: event '${event}' not be found!`);
      this._commiting = true;
      try {
        ret = mutation.call(this, this.state, payload, this.parent, this.root);
      } finally {
        this._commiting = false;
      }
    }

    this.mutationListeners.forEach(v => v({ type: 'UPDATE_DATA', payload }, this.state));
    return ret;
  }

  dispatch(event, payload) {
    if (!event) return;

    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';
    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) throw new Error(`commit error: module '${moduleName}' not be found!`);
      ret = module.dispatch(eventName, payload);
    } else {
      const action = this.actions[event];
      if (!action) throw new Error(`commit error: event '${event}' not be found!`);
      const { state, getters, commit } = this;
      ret = action.call(this, { state, getters, commit });
    }

    this.actionListeners.forEach(v => v({ type: 'UPDATE_DATA', payload }, this.state));
    return ret;
  }

  subscribe(handler) {
    if (!handler || this.mutationListeners.includes(handler)) return;
    this.mutationListeners.push(handler);
    return () => {
      const idx = this.mutationListeners.indexOf(handler);
      if (~idx) this.mutationListeners.splice(idx, 1);
    };
  }

  subscribeAction(handler) {
    if (!handler || this.actionListeners.includes(handler)) return;
    this.actionListeners.push(handler);
    return () => {
      const idx = this.actionListeners.indexOf(handler);
      if (~idx) this.actionListeners.splice(idx, 1);
    };
  }

  install(ReactVueLike, { App }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$store = this;
  }

}

export default Store;

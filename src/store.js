import { observable, extendObservable, when, set, remove } from 'mobx';
import { defComputed } from './utils';

class ReactVueLikeStore {
  constructor(module = {}, parent, root, moduleName) {
    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.moduleName = moduleName || '';
    this.namespaced = module.namespaced || false;

    this.state = {};
    this.getters = {};
    this.mutations = {};
    this.modules = {};

    const _getters = {};
    if (module.getters) {
      Object.keys(module.getters).forEach(key => defComputed(_getters, key, () => {
        let get = module.getters[key];
        return get(this.state, this.getters, this.root.state, this.root.getters);
      }));
    }

    this.state = observable.object(module.state || {});
    this.getters = observable.object(_getters);
    this.mutations = module.mutations ? { ...module.mutations } : {};

    if (this.parent && moduleName) {
      this._mergeState(this.moduleName, this.state);
      this._mergeGetters(this.moduleName, _getters);
      this._mergeMutations(this.moduleName, this.mutations);
    }

    if (module.modules) {
      Object.keys(module.modules).forEach(moduleName => this.registerModule(moduleName, module.modules[moduleName]));
    }

    if (module.install) this.install = module.install.bind(this);
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

  registerModule(moduleName, module) {
    if (!moduleName) return;
    if (this.modules[moduleName]) this.unregisterModule(moduleName);
    if (!module) return;
    this.modules[moduleName] = new ReactVueLikeStore(module, this, this.root, moduleName);
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

    this.modules[moduleName] = null;
  }

  watch(fn, callback) {
    let oldValue;
    return when(() => oldValue !== fn(), callback);
  }

  commit(event, payload) {
    if (!event) return;
    const [moduleName, eventName] = event.split('/')[0];
    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) throw new Error(`commit error: module '${moduleName}' not be found!`);
      ret = module.commit(eventName, payload);
    } else {
      const mutation = this.mutations[event];
      if (!mutation) throw new Error(`commit error: event '${event}' not be found!`);
      ret = mutation.call(this, this.state, payload, this.parent, this.root);
    }

    this.mutationListeners.forEach(v => v({ type: 'UPDATE_DATA', payload }, this.state));
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
}

export default ReactVueLikeStore;

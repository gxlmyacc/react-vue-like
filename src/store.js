import { observable, action, when, set } from 'mobx';
import { defComputed } from './utils';

class ReactVueLikeStore {
  constructor(module = {}, parent, root, namespace) {
    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.namespace = namespace || '';
    this.namespaced = module.namespaced || false;

    const getters = {};
    const prefix = this.prefix;

    const state = module.state || {};
    const mutations = module.mutations || {};
    if (module.getters) {
      Object.keys(module.getters).forEach(key => defComputed(getters, key, () => {
        let get = module.getters[key];
        return get(this.state, this.getters, this.root.state, this.root.getters);
      }));
    }

    const modules = module.modules || {};
    Object.keys(mutations).forEach(key => mutations[key] = action(mutations[key]));
    Object.keys(modules).forEach(key => {
      modules[key] = new ReactVueLikeStore(modules[key], this, this.root, `${prefix}${key}`);
    });

    this.state =  observable.object(state);
    this.getters = observable.object(getters);
    this.mutations = mutations;
    this.modules = modules;

    if (this.root !== this) {
      const _state = {};
      Object.keys(this.state).forEach(key => {
        defComputed(_state, `${prefix}${key}`, () => this.state[key], v => this.state[key] = v);
      });
      set(this.root.state, _state);

      const _getters = {};
      Object.keys(this.getters).forEach(key => {
        defComputed(_getters, `${prefix}${key}`, () => this.getters[key]);
      });
      set(this.root.getters, _getters);
    }
  }

  get prefix() {
    return this.namespaced ? (this.namespace ? this.namespace + '/' : '') : '';
  }

  watch(fn, callback) {
    let oldValue;
    return when(() => oldValue !== fn(), callback);
  }

  commit(event, payload) {
    if (!event) return;

    const mutation = this.mutations[event];
    if (!mutation) return;

    let ret = mutation.call(this, this.state, payload, this.parent, this.root);
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

  install(ReactVueLike) {
    ReactVueLike.$store = ReactVueLike.prototype.$store = this;
  }
}

export default ReactVueLikeStore;

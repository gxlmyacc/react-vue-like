import { observable, action } from 'mobx';

class ReactVueLikeStore {
  constructor(module = {}, parent, root) {
    this.root = root || this;
    this.parent = parent;

    const state = observable.object(module.state || {});
    const mutations = module.mutations || {};
    const modules = module.modules || {};
    Object.keys(mutations).forEach(key => mutations[key] = action(mutations[key]));
    Object.keys(modules).forEach(key => modules[key] = new ReactVueLikeStore(modules[key], this, this.root));

    this.state = state;
    this.mutations = mutations;
  }

  commit(event, payload) {
    if (!event) return;

    let [module, childEvent] = event.split('/');
    if (childEvent) return this.modules[module].commit(childEvent, payload);

    return this.mutations[event](this.state, payload, this.parent, this.root);
  }

  install(ReactVueLike) {
    ReactVueLike.$store = ReactVueLike.prototype.$store = this;
  }
}

export default ReactVueLikeStore;

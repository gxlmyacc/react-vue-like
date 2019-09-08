export default {
  bind(el, binding, vnode) {
    console.log('v-test', 'bind', el, binding, vnode);
  },
  inserted(el, binding, vnode) {
    console.log('v-test', 'inserted', el, binding, vnode);
  },
  update(el, binding, vnode) {
    console.log('v-test', 'update', el, binding, vnode);
  },
  componentUpdated(el, binding, vnode) {
    console.log('v-test', 'componentUpdated', el, binding, vnode);
  },
  unbind(el, binding, vnode) {
    console.log('v-test', 'unbind', el, binding, vnode);
  },
};

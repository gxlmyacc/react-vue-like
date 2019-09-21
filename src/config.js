export function defaultMergeStrategies(parent, child, vm, key) {
  return child;
}

function directivesMergeStrategies(parent, child, vm, key) {
  let ret = {};
  if (parent) return Object.assign(ret, parent);
  if (child) return Object.assign(ret, child);
  return ret;
}

const config = {
  // silent: false,
  errorHandler: null,
  warnHandler: null,

  enforceActions: false,

  keyCodes: {
    // esc: 27,
    // tab: 9,
    // enter: 13,
    // space: 32,
    // up: 38,
    // left: 37,
    // right: 39,
    // down: 40,
    // delete: [8, 46],
    once(eventKeyCode, key, scope) {
      if (scope.handled) return false;
      scope.handled = true;
      return true;
    },
    passive() {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('react not support passive event!');
      }
      return true;
    }
  },

  inheritAttrs: ['className', 'style', 'id', 'disabled'],

  inheritMergeStrategies: {

  },
  optionMergeStrategies: {
    $directives: directivesMergeStrategies,
    $filters: directivesMergeStrategies,
  }
};

export default config;

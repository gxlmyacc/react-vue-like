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

  useAction: true,

  inheritAttrs: ['className', 'style', 'id', 'disabled'],

  inheritMergeStrategies: {

  },
  optionMergeStrategies: {
    $directives: directivesMergeStrategies,
    $filters: directivesMergeStrategies,
  }
};

export default config;

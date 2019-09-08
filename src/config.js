export function defaultMergeStrategies(parent, child, vm) {
  return child;
}

function directivesMergeStrategies(parent, child, vm) {
  let ret = {};
  if (parent) return Object.assign(ret, parent);
  if (child) return Object.assign(ret, child);
  return ret;
}

const config = {
  silent: false,

  errorHandler: null,
  warnHandler: null,

  inheritAttrs: ['className', 'style'],

  inheritMergeStrategies: {

  },
  optionMergeStrategies: {
    $directives: directivesMergeStrategies,
    $filters: directivesMergeStrategies,
  }
};

export default config;

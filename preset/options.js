module.exports = {
  prefix: 'v-',
  attrName: {
    for: 'for',
    show: 'show',
    if: 'if',
    else: 'else',
    elseIf: 'else-if',
    model: 'model',
  },
  inject: {
    attrs: true,
    file: true,
    scopeRegx: /(\.(?:le|sc|sa|c)ss)\?scoped(.*)$/,
    scope: true
  },
  transform: {
    class: false,
    filter: true,
    const: true,
    ref: true,
    slot: true,
  },
  directive: {
    if: true,
    show: true,
    model: true,
    custom: true
  }
};

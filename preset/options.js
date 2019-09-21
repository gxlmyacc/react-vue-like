
const genGuard = function (condition) { return ('if(' + condition + ')return null;'); };

module.exports = {
  prefix: 'v-',
  compRegx: /^([A-Z])|([a-z][a-z0-9]+-[a-z0-9]+)/,
  keyCodes: {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    delete: [8, 46]
  },
  modifierCode: {
    stop: '_e.stopPropagation();',
    prevent: '_e.preventDefault();',
    persist: '_e.persist();',
    native: '_e=_e.nativeEvent;',
    self: genGuard('_e.target !== _e.currentTarget'),
    ctrl: genGuard('!_e.ctrlKey'),
    shift: genGuard('!_e.shiftKey'),
    alt: genGuard('!_e.altKey'),
    meta: genGuard('!_e.metaKey'),
    left: genGuard("'button' in _e && _e.button !== 0"),
    middle: genGuard("'button' in _e && _e.button !== 1"),
    right: genGuard("'button' in _e && _e.button !== 2")
  },
  genGuard,
  attrName: {
    for: 'for',
    show: 'show',
    if: 'if',
    else: 'else',
    elseIf: 'else-if',
    model: 'model',
    html: 'html',
  },
  inject: {
    attrs: true,
    file: true,
    scopeRegx: /(\.(?:le|sc|sa|c)ss)\?scoped(.*)$/,
    scope: true
  },
  transform: {
    class: true,
    require: {
      img: 'src'
    },
    modifier: true,
    component: true,
    action: true,
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

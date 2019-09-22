
const genGuard = function (condition) { return ('if(' + condition + ')return null;'); };

module.exports = {
  prefix: 'v-',
  compRegx: /^([A-Z])|([a-z][a-z0-9]+-[a-z0-9]+)/,
  forRegx: /\.(map|filter|reverse|sort|slice|flat|flatMap)$/,
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
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    persist: '$event.persist();',
    native: '$event=$event.nativeEvent;',
    self: genGuard('$event.target !== $event.currentTarget'),
    ctrl: genGuard('!$event.ctrlKey'),
    shift: genGuard('!$event.shiftKey'),
    alt: genGuard('!$event.altKey'),
    meta: genGuard('!$event.metaKey'),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
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
    attrs: false,
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

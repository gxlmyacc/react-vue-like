if (!Date.prototype.format) {
  Date.prototype.format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    Object.keys(o).forEach(k => {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    });
    return fmt;
  };
}

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
    file: true,
    scopeRegx: /\.((?:le|sc|sa|c)ss)\?scoped(.*)$/,
    scope: true
  },
  transform: {
    class: false,
    filter: true,
    const: true,
    ref: true,
  },
  directive: {
    if: true,
    show: true,
    model: true,
    custom: true
  }
};

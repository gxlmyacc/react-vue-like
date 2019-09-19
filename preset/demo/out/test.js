"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

var _dpl = require("dpl");

require("./main-sider.scss?react-vue-like&scoped=true&id=v-555c74e4");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Sider = _dpl.Layout.Sider;

class MainSider extends _reactVueLike.default {
  static data() {
    return {
      loaded: false,
      hideMenu: false,
      currentMenu: {},
      lastPath: '',
      list: []
    };
  }

  mounted() {
    this.init();
  }

  render() {
    var _this = this;

    if (!this.loaded) return null;
    const currentMenu = this.currentMenu; // console.log('currentMenu', currentMenu);

    console.log('this.hideMenu`', this.hideMenu, this.list.length, Boolean(!this.hideMenu && this.list.length));
    return _react.default.createElement(Sider, this._resolveSpreadAttrs("Sider", {
      className: "v-555c74e4 main-sider",
      width: 'max-content'
    }), _react.default.createElement(_dpl.LeftMenu, {
      data: this.list,
      openKeys: currentMenu && currentMenu.parentKey ? [currentMenu.parentKey] : null,
      selectedKeys: currentMenu ? [currentMenu.key] : null,
      beforeSelect: this.goMenu,
      onSelect: function onSelect(path, menu) {
        return menu.stubborn && _this.goMenu(path, menu, function () {});
      },
      height: '100%',
      defaultLock: true,
      className: "v-555c74e4",
      style: {
        display: !this.hideMenu && this.list.length ? null : "none"
      }
    }));
  }

}

MainSider.__file = "/preset/demo/src/test.js";

_defineProperty(MainSider, "watch", {
  '$route'(newVal, oldVal) {
    if (!newVal || !oldVal) return;
    if (newVal.path !== oldVal.path) this.updateList(newVal);
  }

});

_defineProperty(MainSider, "methods", {
  init() {
    this.updateList(this.$route);
    this.loaded = true;
  },

  updateList(route) {
    var _this2 = this;

    let list = [];
    let isMainCommon = route.matched.some(function (r) {
      return r.meta.mainCommon;
    });

    if (isMainCommon && !route.query.redirect) {
      this.hideMenu = true;
      return;
    }

    let matched = isMainCommon ? this.$router.getMatched(route.query.redirect) : route.matched;
    let currentRoute = matched[1] && matched[1].config;

    let findMenuList = function findMenuList(routes, parent) {
      let ret = [];

      let findMenu = _this2._resolveEvent(function (r, parent) {
        if (!r.meta.title) return;
        let menu = {
          parentKey: parent ? parent.key : undefined,
          key: r.path,
          text: r.meta.title,
          icon: r.meta.icon ? _react.default.createElement("i", {
            className: "v-555c74e4" + ' ' + `iconfont ${r.meta.icon}`
          }) : null
        };
        menu.children = findMenuList(r.children, menu);
        return menu;
      });

      if (!routes || !routes.length) return ret;
      routes.forEach(function (r) {
        let menu = findMenu(r, parent);
        if (menu) ret.push(menu);
      });
      return ret;
    };

    if (currentRoute) {
      list = findMenuList(currentRoute.children);

      if (currentRoute.meta.hasBack) {
        list.unshift({
          key: 'back',
          text: '返回'
        });
      }
    }

    this.list = list;
    this.updateMenu(route, isMainCommon);
  },

  updateMenu(route, isMainCommon) {
    let currentPath = isMainCommon ? route.query.redirect : route.path;
    let currentMenu;

    let findMenuList = function findMenuList(menuList, parent) {
      let findMenu = function findMenu(menu) {
        if (!currentPath.startsWith(menu.key)) return;

        if (!currentMenu || currentMenu.key.length < menu.key.length) {
          currentMenu = menu;
        }

        if (menu.children) findMenuList(menu.children, menu);
      };

      menuList.forEach(function (m) {
        return findMenu(m, parent);
      });
    };

    findMenuList(this.list);
    this.currentMenu = currentMenu;
  },

  goMenu(path, menu, callback) {
    if (path === 'back') {
      this.$router.replace(this.$config.mainPage, function () {
        return callback(true);
      }, function () {
        return callback(false);
      });
    } else {
      this.$router.push(path, function () {
        return callback(true);
      }, function () {
        return callback(false);
      });
    }
  }

});

var _default = MainSider;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNamespacedHelpers = exports.mapActions = exports.mapGetters = exports.mapMutations = exports.mapState = void 0;

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param,
 *                                you can do something for state and getters in it.
 * @param {Object}
 */
const mapState = normalizeNamespace(function (namespace, states) {
  const res = {};
  normalizeMap(states).forEach(function (_ref) {
    let key = _ref.key,
        val = _ref.val;

    res[key] = function mappedState() {
      let state = this.$store.state;
      let getters = this.$store.getters;

      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace);

        if (!module) {
          return;
        }

        state = module.context.state;
        getters = module.context.getters;
      }

      return typeof val === 'function' ? val.call(this, state, getters) : state[val];
    }; // mark vuex getter for devtools


    res[key].vuex = true;
  });
  return res;
});
/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as
 *                                   the first param, it can accept anthor params. You can commit mutation
 *                                   and do any other things in this function. specially, You need to pass
 *                                   anthor params from the mapped function.
 * @return {Object}
 */

exports.mapState = mapState;
const mapMutations = normalizeNamespace(function (namespace, mutations) {
  const res = {};
  normalizeMap(mutations).forEach(function (_ref2) {
    let key = _ref2.key,
        val = _ref2.val;

    res[key] = function mappedMutation() {
      // Get the commit method from store
      let commit = this.$store.commit;

      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace);

        if (!module) {
          return;
        }

        commit = module.context.commit;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return typeof val === 'function' ? val.apply(this, [commit].concat(args)) : commit.apply(this.$store, [val].concat(args));
    };
  });
  return res;
});
/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */

exports.mapMutations = mapMutations;
const mapGetters = normalizeNamespace(function (namespace, getters) {
  const res = {};
  normalizeMap(getters).forEach(function (_ref3) {
    let key = _ref3.key,
        val = _ref3.val;
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;

    res[key] = function mappedGetter() {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return;
      }

      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(`[ReactVueLike.Store] unknown getter: ${val}`);
        return;
      }

      return this.$store.getters[val];
    }; // mark vuex getter for devtools


    res[key].vuex = true;
  });
  return res;
});
/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the
 *                                 first param, it can accept anthor params. You can dispatch action and do
 *                                 any other things in this function. specially, You need to pass anthor
 *                                 params from the mapped function.
 * @return {Object}
 */

exports.mapGetters = mapGetters;
const mapActions = normalizeNamespace(function (namespace, actions) {
  const res = {};
  normalizeMap(actions).forEach(function (_ref4) {
    let key = _ref4.key,
        val = _ref4.val;

    res[key] = function mappedAction() {
      // get dispatch function from store
      let dispatch = this.$store.dispatch;

      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapActions', namespace);

        if (!module) {
          return;
        }

        dispatch = module.context.dispatch;
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return typeof val === 'function' ? val.apply(this, [dispatch].concat(args)) : dispatch.apply(this.$store, [val].concat(args));
    };
  });
  return res;
});
/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */

exports.mapActions = mapActions;

const createNamespacedHelpers = function createNamespacedHelpers(namespace) {
  return {
    mapState: mapState.bind(null, namespace),
    mapGetters: mapGetters.bind(null, namespace),
    mapMutations: mapMutations.bind(null, namespace),
    mapActions: mapActions.bind(null, namespace)
  };
};
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */


exports.createNamespacedHelpers = createNamespacedHelpers;

function normalizeMap(map) {
  return Array.isArray(map) ? map.map(function (key) {
    return {
      key,
      val: key
    };
  }) : Object.keys(map).map(function (key) {
    return {
      key,
      val: map[key]
    };
  });
}
/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then
 * the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */


function normalizeNamespace(fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }

    return fn(namespace, map);
  };
}
/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */


function getModuleByNamespace(store, helper, namespace) {
  const module = store.modules[namespace];

  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(`[ReactVueLike.Store] module namespace not found in ${helper}(): ${namespace}`);
  }

  return module;
}
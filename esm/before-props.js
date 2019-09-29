"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeProps;

var _react = _interopRequireDefault(require("react"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateProps(aPropTypes, aProps) {
  const ret = {
    propTypes: {},
    defaultProps: {}
  };
  if (!aPropTypes) return ret;

  if (Array.isArray(aPropTypes)) {
    const _propTypes = {};
    aPropTypes.forEach(function (key) {
      return _propTypes[key] = {
        type: null
      };
    });
    aPropTypes = _propTypes;
  }

  Object.keys(aPropTypes).forEach(function (key) {
    let propType = aPropTypes[key];
    if (propType.default !== undefined) ret.defaultProps[key] = propType.default;

    function getPropType(propType) {
      const typeMaps = [{
        type: String,
        value: _propTypes2.default.string
      }, {
        type: Array,
        value: _propTypes2.default.array
      }, {
        type: Object,
        value: _propTypes2.default.object
      }, {
        type: Boolean,
        value: _propTypes2.default.bool
      }, {
        type: Function,
        value: _propTypes2.default.func
      }, {
        type: String,
        value: _propTypes2.default.string
      }, {
        type: Number,
        value: _propTypes2.default.number
      }, {
        type: Symbol,
        value: _propTypes2.default.symbol
      }, {
        type: _react.default.Component,
        value: _propTypes2.default.element
      }];

      function _getPropType(type, required) {
        let ret = _propTypes2.default.any;

        if (type) {
          let v = typeMaps.find(function (v) {
            return v.type === type;
          });
          if (v) ret = v.value;else if (v instanceof type) _propTypes2.default.instanceOf(type);
        }

        if (required) ret = ret.isRequired;
        return ret;
      }

      if (Object.isFunction(propType)) return _getPropType(propType);
      const type = propType.type,
            required = propType.required,
            validator = propType.validator;
      let retType;

      if (validator) {
        return function (props, propName, componentName) {
          if (!validator(props[propName])) return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Validation failed.`);
        };
      }

      if (!type) retType = required ? _propTypes2.default.any.isRequired : _propTypes2.default.any;
      if (Array.isArray(type)) retType = _propTypes2.default.oneOfType(type.map(function (v) {
        return _getPropType(v, required);
      }));else retType = _getPropType(type, required);
      return retType;
    } // eslint-disable-next-line


    ret.propTypes[key] = getPropType(propType);
  });
  return ret;
}

function beforeProps(source, target) {
  if (!target) target = source;
  const props = source.props;
  if (!props) return source; // eslint-disable-next-line

  const _generateProps = generateProps(props || {}),
        propTypes = _generateProps.propTypes,
        defaultProps = _generateProps.defaultProps;

  if (defaultProps) {
    if (!target.defaultProps) target.defaultProps = {};
    Object.assign(target.defaultProps, defaultProps);
  } // eslint-disable-next-line


  if (propTypes && !target.propTypes) {
    // eslint-disable-next-line
    if (!target.propTypes) target.propTypes = {}; // eslint-disable-next-line

    Object.assign(target.propTypes, propTypes);
  }

  return target;
}
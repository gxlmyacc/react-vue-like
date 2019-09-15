
import React from 'react';
import PropTypes from 'prop-types';

function generateProps(aPropTypes, aProps) {
  const ret = { propTypes: {}, defaultProps: {} };
  if (!aPropTypes) return ret;

  if (Array.isArray(aPropTypes)) {
    const _propTypes = {};
    aPropTypes.forEach(key => _propTypes[key] = { type: null });
    aPropTypes = _propTypes;
  }

  Object.keys(aPropTypes).forEach(key => {
    let propType = aPropTypes[key];

    if (propType.default !== undefined) ret.defaultProps[key] = propType.default;

    function getPropType(propType) {
      const typeMaps = [
        { type: String, value: PropTypes.string },
        { type: Array, value: PropTypes.array },
        { type: Object, value: PropTypes.object },
        { type: Boolean, value: PropTypes.bool },
        { type: Function, value: PropTypes.func },
        { type: String, value: PropTypes.string },
        { type: Number, value: PropTypes.number },
        { type: Symbol, value: PropTypes.symbol },
        { type: React.Component, value: PropTypes.element },
      ];
      function _getPropType(type, required) {
        let ret = PropTypes.any;
        let v = typeMaps.find(v => v.type === type);
        if (v) ret = v.value;
        else if (v instanceof type) PropTypes.instanceOf(type);
        if (required) ret = ret.isRequired;
        return ret;
      }

      if (Object.isFunction(propType)) return _getPropType(propType);

      const { type, required, validator } = propType;

      let retType;
      if (validator) {
        return function (props, propName, componentName) {
          if (!validator(props[propName])) return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Validation failed.`);
        };
      }
      if (!type) retType = required ? PropTypes.any.isRequired : PropTypes.any;

      if (Array.isArray(type)) retType = PropTypes.oneOfType(type.map(v => _getPropType(v, required)));
      else retType = _getPropType(type, required);
      return retType;
    }
    // eslint-disable-next-line
    ret.propTypes[key] = getPropType(propType);
  });
  return ret;
}

export default function beforeProps(source, target) {
  if (!target) target = source;
  const { props } = source;
  if (!props) return source;

  // eslint-disable-next-line
  const { propTypes, defaultProps } = generateProps(props || {});
  if (defaultProps) {
    if (!target.defaultProps) target.defaultProps = {};
    Object.assign(target.defaultProps, defaultProps);
  }

  // eslint-disable-next-line
  if (propTypes && !target.propTypes) {
    // eslint-disable-next-line
    if (!target.propTypes) target.propTypes = {};
    // eslint-disable-next-line
    Object.assign(target.propTypes, propTypes);
  }
  return target;
}

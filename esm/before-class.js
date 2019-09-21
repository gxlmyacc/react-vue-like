"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeClass;

var _utils = require("./utils");

function parseClassName(source, className) {
  if (!className) return source;
  if (typeof className === 'string') source.push(className);
  if (Array.isArray(className)) className.forEach(function (c) {
    return parseClassName(source, c);
  });else if ((0, _utils.isObject)(className)) Object.keys(className).forEach(function (c) {
    return className[c] && parseClassName(source, c);
  });
  return source;
}

function beforeClass(props) {
  if (!props || !props.className || typeof props.className === 'string') return;
  props.className = parseClassName([], props.className).join(' ');
}
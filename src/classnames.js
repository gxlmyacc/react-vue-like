import { isObject, isFunction } from './utils';

function parseClassName(source, className) {
  if (!className) return source;
  if (typeof className === 'string') source.push(className);
  if (Array.isArray(className)) className.forEach(c => parseClassName(source, c));
  else if (isObject(className)) Object.keys(className).forEach(c => className[c] && parseClassName(source, c));
  else if (isFunction(className)) parseClassName(source, className);
  return source;
}

export default function classNames(className) {
  if (!className || typeof className === 'string') return className;
  return parseClassName([], className).join(' ');
}

export function beforeClass(props) {
  props.className = classNames(props && props.className);
}

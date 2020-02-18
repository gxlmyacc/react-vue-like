import { isObject } from './utils';

function parseClassName(source, className) {
  if (!className) return source;
  if (typeof className === 'string') source.push(className);
  if (Array.isArray(className)) className.forEach(c => parseClassName(source, c));
  else if (isObject(className)) Object.keys(className).forEach(c => className[c] && parseClassName(source, c));
  return source;
}

export default function beforeClass(props, ReactVueLike) {
  if (!props || !props.className || typeof props.className === 'string') return;
  props.className = parseClassName([], props.className).join(' ');
}

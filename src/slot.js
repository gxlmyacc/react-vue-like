import { innumerable } from './utils';

function Slot({ $context, children, ...props }) {
  return $context ? $context._s(props, children) : null;
}

innumerable(Slot, 'vuelikeConstructor', function () {
  // nothing
});

export default Slot;
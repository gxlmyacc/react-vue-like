import { useLocalStore, useObserver } from 'mobx-react-lite';
import { isFunction } from './utils';

function VuelikeObserver({ props = {}, render, children, }) {
  const storeProps = useLocalStore(() => props);

  return useObserver(() => (render 
    ? render(storeProps) 
    : isFunction(children) ? children(storeProps) : children));
}

export default VuelikeObserver;
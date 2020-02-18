import collect from './collect';

export default function beforeCollect(target, ReactVueLike) {
  let t = target.prototype;
  if (hasOwnProperty.call(t, 'render')) {
    t._renderFn = collect.wrap(t.render, ReactVueLike.prototype._eachRenderElement);
    delete t.render;
  }
  if (hasOwnProperty.call(t, 'renderError')) {
    t._renderErrorFn = collect.wrap(t.renderError, ReactVueLike.prototype._eachRenderElement);
    delete t.renderError;
  }
}


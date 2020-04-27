import collect from './collect';

export default function beforeCollect(target, ReactVueLike) {
  if (target.render) {
    target.render = collect.wrap(target.render, ReactVueLike.prototype._eachRenderElement);
  }
  if (target.renderError) {
    target.renderError = collect.wrap(target.renderError, ReactVueLike.prototype._eachRenderElement);
  }
}


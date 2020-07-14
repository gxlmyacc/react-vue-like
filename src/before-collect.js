import collect from './collect';

export default function beforeCollect(target, VuelikeComponent) {
  if (target.render) {
    target.render = collect.wrap(target.render, VuelikeComponent.prototype.componentEachJSXElement);
  }
  if (target.renderError) {
    target.renderError = collect.wrap(target.renderError, VuelikeComponent.prototype.componentEachJSXElement);
  }
}


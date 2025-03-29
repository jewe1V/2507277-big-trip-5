import { createElement } from '../render.js';

export default class RoutePointListView {
  getTemplate() {
    return createPointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

function createPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

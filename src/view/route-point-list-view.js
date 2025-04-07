import AbstractView from '../framework/view/abstract-view.js';

export default class RoutePointListView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createPointListTemplate();
  }
}

function createPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

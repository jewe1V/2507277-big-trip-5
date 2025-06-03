import AbstractView from '../framework/view/abstract-view.js';

export default class ListEmptyView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createEmptyListTemplate();
  }
}

function createEmptyListTemplate() {
  return `
  <p class="trip-events__msg">Click New Event to create your first point</p>
  `;
}

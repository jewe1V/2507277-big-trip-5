import AbstractView from '../framework/view/abstract-view.js';
import { createPointsTemplate } from './points-template.js';

export default class RoutePointView extends AbstractView {
  #event = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;

  constructor(event, destination, offers) {
    super();
    this.#event = event || {};
    this.#destination = destination || {};
    this.#offers = offers || [];
  }

  get template() {
    return createPointsTemplate(this.#event, this.#destination, this.#offers);
  }

  addEventListeners() {
    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#editClickHandler.bind(this));
    }
  }

  setEditClickHandler(callback) {
    this.#handleEditClick = callback;
  }

  #editClickHandler(evt) {
    evt.preventDefault();
    if (this.#handleEditClick) {
      this.#handleEditClick();
    }
  }
}

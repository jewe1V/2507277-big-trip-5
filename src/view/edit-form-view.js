import AbstractView from '../framework/view/abstract-view.js';
import { createFormTemplate } from './form-template.js';

export default class EditFormView extends AbstractView {
  #event = null;
  #destinationModel = null;
  #offerModel = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;

  constructor(event, destinationModel, offerModel) {
    super();
    this.#event = event || {};
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
  }

  get template() {
    return createFormTemplate(this.#event, this.#destinationModel, this.#offerModel);
  }

  addEventListeners() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler.bind(this));
    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler.bind(this));
    }
  }

  setFormSubmitHandler(callback) {
    this.#handleFormSubmit = callback;
  }

  setRollupClickHandler(callback) {
    this.#handleRollupClick = callback;
  }

  #formSubmitHandler(evt) {
    evt.preventDefault();
    if (this.#handleFormSubmit) {
      this.#handleFormSubmit();
    }
  }

  #rollupClickHandler(evt) {
    evt.preventDefault();
    if (this.#handleRollupClick) {
      this.#handleRollupClick();
    }
  }
}

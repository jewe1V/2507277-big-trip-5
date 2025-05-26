import { render, remove } from '../framework/render.js';
import CreateFormView from '../view/create-form-view.js';
import { UpdateType, UserAction } from '../consts.js';
import { isEscapeKey } from '../utils.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #pointModel = null;
  #formComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ pointListContainer, pointModel, onDataChange, onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#pointModel = pointModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    console.log('NewPointPresenter: Initializing new point form');
    if (this.#formComponent) {
      console.log('NewPointPresenter: Form already exists');
      return;
    }

    this.#formComponent = new CreateFormView({
      offers: this.#pointModel.offers,
      destinations: this.#pointModel.destinations,
      onFormSubmit: this.#formSubmitHandler,
      onFormReset: this.#formResetHandler
    });

    render(this.#formComponent, this.#pointListContainer, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyHandler);
  }

  destroy() {
    console.log('NewPointPresenter: Destroying new point form');
    if (!this.#formComponent) {
      return;
    }
    this.#handleDestroy();
    remove(this.#formComponent);
    this.#formComponent = null;
    document.removeEventListener('keydown', this.#escKeyHandler);
  }

  #escKeyHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      console.log('NewPointPresenter: Escape key pressed');
      this.destroy();
    }
  };

  #formSubmitHandler = (point) => {
    console.log('NewPointPresenter: Form submitted', point);
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point);
    this.destroy();
  };

  #formResetHandler = () => {
    console.log('NewPointPresenter: Form reset');
    this.destroy();
  };
}

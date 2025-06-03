import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../consts.js';
import {isEscapeKey} from '../utils.js';
import EditFormView from '../view/edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #onDataChange = null;
  #onDestroy = null;
  #currentPoint = null;
  #pointEditComponent = null;

  constructor(pointListContainer, onDataChange, onDestroy) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init(offerModel, destinationModel) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#currentPoint = this.#currentPoint || {
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: 1,
      offers: [],
      type: 'flight',
      isFavorite: false
    };

    this.#pointEditComponent = new EditFormView(
      this.#currentPoint,
      offerModel,
      destinationModel,
      this.#onFormSubmit,
      this.#onDeleteClick
    );

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #onFormSubmit = (_, point) => {
    this.#currentPoint = point;
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}

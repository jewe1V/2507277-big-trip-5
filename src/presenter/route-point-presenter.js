import { render, replace, remove } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
import { Mode, UpdateType, UserAction } from '../consts.js';

export default class RoutePointPresenter {
  #destinations = null;
  #offers = null;
  #point = null;
  #pointItem = null;
  #editFormItem = null;
  #pointsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  #escKeyHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor({ destinations, offers, pointsListComponent, changeDataOnFavorite, changeMode }) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointsListComponent = pointsListComponent;
    this.#handleDataChange = changeDataOnFavorite;
    this.#handleModeChange = changeMode;
  }

  init(routePoint) {
    this.#point = routePoint;
    const prevPointComponent = this.#pointItem;
    const prevEditFormComponent = this.#editFormItem;

    this.#pointItem = new RoutePointView({
      point: this.#point,
      destinations: this.#destinations,
      onRollButtonClick: () => {
        this.#replacePointToEditForm();
      },
      onFavoriteClick: () => {
        this.#addToFavorite();
      }
    });

    this.#editFormItem = new EditFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#editFormSubmitHandler,
      onFormReset: this.#editFormResetHandler,
      onDeleteClick: this.#deleteClickHandler
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      if (this.#pointsListComponent.element) {
        render(this.#pointItem, this.#pointsListComponent.element);
      }
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointItem, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormItem, prevEditFormComponent);
    }
  }

  destroy() {
    remove(this.#pointItem);
    remove(this.#editFormItem);
    document.removeEventListener('keydown', this.#escKeyHandler);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    this.#handleModeChange();
    replace(this.#editFormItem, this.#pointItem);
    document.addEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editFormItem);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  }

  #addToFavorite() {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  }

  #editFormSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MAJOR, point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #editFormResetHandler = () => {
    this.#editFormItem.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #deleteClickHandler = () => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, this.#point);
    document.removeEventListener('keydown', this.#escKeyHandler);
  };
}

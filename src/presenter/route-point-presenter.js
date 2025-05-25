import { render, replace} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
import { Mode } from '../consts.js';

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
        this.#addToFaivorite();
      }
    });

    this.#editFormItem = new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      onRollButtonClick: () => {
        this.#replaceEditFormToPoint();
      },
      onSubmitClick: () => {
        this.#replaceEditFormToPoint();
      }
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

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    this.#handleModeChange(); // Уведомляем о смене режима
    replace(this.#editFormItem, this.#pointItem);
    document.addEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editFormItem);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  }

  #addToFaivorite() {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  }
}

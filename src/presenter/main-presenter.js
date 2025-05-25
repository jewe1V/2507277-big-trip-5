import { render } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import { generateFilter } from '../mock/filters-mock.js';
import RoutePointPresenter from './route-point-presenter.js';

export default class MainPresenter {
  #RoutePointListComponent = new RoutePointListView();
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripEvents = null;
  #tripControlFilters = null;
  #points = null;
  #destinations = null;
  #offers = null;
  #pointPresenters = new Map();

  constructor({ pointModel, offerModel, destinationModel }) {
    this.#pointsModel = pointModel;
    this.#offersModel = offerModel;
    this.#destinationsModel = destinationModel;
    this.#tripEvents = document.querySelector('.trip-events');
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.#points = this.#pointsModel.points;
    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    const filters = generateFilter(this.#points) || [];

    if (this.#points.length > 0) {
      render(new FiltersView({ filters }), this.#tripControlFilters);
      render(new SortingView(), this.#tripEvents);
      render(this.#RoutePointListComponent, this.#tripEvents);

      this.#points.forEach((point) => {
        this.#renderPoint(point);
      });
    } else {
      render(new ListEmptyView(), this.#tripEvents);
    }
  }

  #handleDataChange(updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #handleModeChange() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #renderPoint(point) {
    const routePointPresenter = new RoutePointPresenter({
      destinations: this.#destinations,
      offers: this.#offers,
      pointsListComponent: this.#RoutePointListComponent,
      changeDataOnFavorite: this.#handleDataChange.bind(this),
      changeMode: this.#handleModeChange.bind(this)
    });
    routePointPresenter.init(point);
    this.#pointPresenters.set(point.id, routePointPresenter);
  }
}

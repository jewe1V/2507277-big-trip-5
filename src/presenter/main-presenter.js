import { render, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import { generateFilter } from '../mock/filters-mock.js';
import RoutePointPresenter from './route-point-presenter.js';
import {SortType} from '../consts';

export default class MainPresenter {
  #RoutePointListComponent = new RoutePointListView();
  #sortingComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripEvents = null;
  #tripControlFilters = null;
  #points = null;
  #destinations = null;
  #offers = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

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
      this.#renderSort();
      render(this.#RoutePointListComponent, this.#tripEvents);
      this.#renderPoints();
    } else {
      render(new ListEmptyView(), this.#tripEvents);
    }
  }

  #renderSort() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange.bind(this)
    });
    render(this.#sortingComponent, this.#tripEvents, 'beforebegin');
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  }

  #sortPoints(points) {
    const sortedPoints = [...points];

    switch (this.#currentSortType) {
      case SortType.DAY:
        return sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom) || a.id - b.id);
      case SortType.TIME:
        return sortedPoints.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA || a.id - b.id;
        });
      case SortType.PRICE:
        return sortedPoints.sort((a, b) => b.basePrice - a.basePrice || a.id - b.id);
      default:
        return sortedPoints;
    }
  }

  #renderPoints() {
    const sortedPoints = this.#sortPoints(this.#points);
    sortedPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortingComponent);
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

  #handleDataChange(updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  }

  #handleModeChange() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }
}

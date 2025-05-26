// presenter/main-presenter.js
import { render, remove } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import RoutePointPresenter from './route-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UpdateType, FilterType, EmptyListMessages, UserAction } from '../consts.js';

export default class MainPresenter {
  #RoutePointListComponent = new RoutePointListView();
  #sortingComponent = null;
  #emptyListComponent = null;
  #pointModel = null;
  #filterModel = null;
  #tripEvents = null;
  #points = null;
  #destinations = null;
  #offers = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #isCreating = false;

  constructor({ pointModel, filterModel }) {
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#tripEvents = document.querySelector('.trip-events');
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#RoutePointListComponent.element,
      pointModel,
      onDataChange: this.#handleDataChange.bind(this),
      onDestroy: this.#handleNewPointFormClose.bind(this)
    });
  }

  init() {
    this.#points = this.#pointModel.points;
    this.#destinations = this.#pointModel.destinations;
    this.#offers = this.#pointModel.offers;

    this.#filterModel.addObserver(this.#handleModelEvent.bind(this));
    this.#pointModel.addObserver(this.#handleModelEvent.bind(this));

    this.#renderBoard();

    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    newEventButton.addEventListener('click', this.#handleNewEventClick.bind(this));
  }

  #calculateTotalCost() {
    return this.#points.reduce((total, point) => {
      const pointOffers = this.#offers.find((offer) => offer.type === point.type)?.offers || [];
      const selectedOffersCost = point.offers.reduce((sum, offerId) => {
        const offer = pointOffers.find((o) => o.id === offerId);
        return sum + (offer ? offer.price : 0);
      }, 0);
      return total + point.basePrice + selectedOffersCost;
    }, 0);
  }

  #renderBoard() {
    this.#points = this.#pointModel.points;
    if (this.#points.length === 0 && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    render(this.#RoutePointListComponent, this.#tripEvents);
    this.#renderSort();
    this.#renderPoints();
    this.#updateTripInfo();
  }

  #renderEmptyList() {
    this.#emptyListComponent = new ListEmptyView({
      message: EmptyListMessages[this.#filterModel.filter] || EmptyListMessages[FilterType.EVERYTHING]
    });
    render(this.#emptyListComponent, this.#tripEvents);
  }

  #renderSort() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange.bind(this)
    });
    render(this.#sortingComponent, this.#tripEvents, 'afterbegin');
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderBoard();
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
    if (this.#sortingComponent) {
      remove(this.#sortingComponent);
    }
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
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

  #updateTripInfo() {
    const totalCost = this.#calculateTotalCost();
    const tripInfoElement = document.querySelector('.trip-info__cost-value');
    if (tripInfoElement) {
      tripInfoElement.textContent = totalCost;
    }
  }

  #handleDataChange(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        this.#isCreating = false;
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent(updateType) {
    if (updateType === UpdateType.FILTER) {
      this.#currentSortType = SortType.DAY;
    }
    this.#clearPoints();
    this.#renderBoard();
  }

  #handleModeChange() {
    if (this.#isCreating) {
      this.#newPointPresenter.destroy();
      this.#isCreating = false;
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleNewEventClick() {
    if (this.#isCreating || this.#pointPresenters.size > 0) {
      this.#pointPresenters.forEach((presenter) => presenter.resetView());
      if (this.#isCreating) {
        this.#newPointPresenter.destroy();
        this.#isCreating = false;
      }
    }

    this.#filterModel.setFilter(UpdateType.FILTER, FilterType.EVERYTHING);
    this.#pointModel.setFilter(FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;
    this.#isCreating = true;
    this.#newPointPresenter.init();
  }

  #handleNewPointFormClose() {
    this.#isCreating = false;
    this.#clearPoints();
    this.#renderBoard();
  }
}

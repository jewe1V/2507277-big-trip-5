import { render, RenderPosition } from '../render';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import RoutePointView from '../view/route-point-view';
import RoutePointListView from '../view/route-point-list-view';
import EditFormView from '../view/edit-form-view';

export default class Presenter {
  #routePointListComponent = new RoutePointListView();
  #routePointsComponents = new Map();

  constructor(destinationModel, eventModel, offerModel) {
    this.tripEvents = document.querySelector('.trip-events');
    this.tripControlFilters = document.querySelector('.trip-controls__filters');
    this.destinationModel = destinationModel;
    this.eventModel = eventModel;
    this.offerModel = offerModel;
  }

  init() {
    const events = this.eventModel.getEvents();

    render(new FiltersView(), this.tripControlFilters);
    render(new SortingView(), this.tripEvents);
    render(this.#routePointListComponent, this.tripEvents);

    for (let i = 0; i < Math.min(3, events.length); i++) {
      this.#renderRoutePoint(events[i]);
    }

    document.addEventListener('keydown', this.#handleEscapeKey.bind(this));
  }

  #renderRoutePoint(event) {
    const destination = this.destinationModel.getDestinationById(event.destination);
    const eventOffers = this.offerModel.getOffersByType(event.type).filter((offer) =>
      event.offers.includes(offer.id)
    );

    const routePointComponent = new RoutePointView(event, destination, eventOffers);
    const editFormComponent = new EditFormView(event, this.destinationModel, this.offerModel);

    routePointComponent.setEditClickHandler(() =>
      this.#replaceRoutePointToEditForm(routePointComponent, editFormComponent)
    );
    editFormComponent.setFormSubmitHandler(() =>
      this.#replaceEditFormToRoutePoint(routePointComponent, editFormComponent)
    );
    editFormComponent.setRollupClickHandler(() =>
      this.#replaceEditFormToRoutePoint(routePointComponent, editFormComponent)
    );

    this.#routePointsComponents.set(routePointComponent, editFormComponent);
    render(routePointComponent, this.#routePointListComponent.element, RenderPosition.BEFOREEND);
    routePointComponent.addEventListeners();
  }

  #replaceRoutePointToEditForm(routePointComponent, editFormComponent) {
    this.#routePointListComponent.element.replaceChild(editFormComponent.element, routePointComponent.element);
  }

  #replaceEditFormToRoutePoint(routePointComponent, editFormComponent) {
    this.#routePointListComponent.element.replaceChild(routePointComponent.element, editFormComponent.element);
  }

  #handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
      for (const [routePointComponent, editFormComponent] of this.#routePointsComponents) {
        if (this.#routePointListComponent.element.contains(editFormComponent.element)) {
          this.#replaceEditFormToRoutePoint(routePointComponent, editFormComponent);
          break;
        }
      }
    }
  }
}

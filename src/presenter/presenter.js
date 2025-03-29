import { render } from '../render';
import EditFormView from '../view/edit-form-view';
import FiltersView from '../view/filters-view';
import RoutePointView from '../view/route-point-view';
import RoutePointListView from '../view/route-point-list-view';
import SortingView from '../view/sorting-view';


export default class Presenter {
  RoutePointListComponent = new RoutePointListView();

  constructor(DestinationModel, EventModel, OfferModel) {
    this.tripEvents = document.querySelector('.trip-events');
    this.tripControlFilters = document.querySelector('.trip-controls__filters');
    this.destinationModel = DestinationModel;
    this.eventModel = EventModel;
    this.offerModel = OfferModel;
  }

  init() {
    const events = this.eventModel.getEvents();

    render(new FiltersView(), this.tripControlFilters);
    render(new SortingView(), this.tripEvents);
    render(this.RoutePointListComponent, this.tripEvents);
    render(
      new EditFormView(events[0], this.destinationModel, this.offerModel),
      this.RoutePointListComponent.getElement()
    );

    for (let i = 0; i < Math.min(3, events.length); i++) {
      const event = events[i];
      const destination = this.destinationModel.getDestinationById(event.destination);
      const eventOffers = this.offerModel.getOffersByType(event.type).filter((offer) =>
        event.offers.includes(offer.id)
      );
      render(
        new RoutePointView(event, destination, eventOffers),
        this.RoutePointListComponent.getElement()
      );
    }
  }
}


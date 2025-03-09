import { render } from '../render';
import CreateFormView from '../view/create-form-view';
import EditFormView from '../view/edit-form-view';
import FiltersView from '../view/filters-view';
import RoutePointView from '../view/route-point-view';
import RoutePointListView from '../view/route-point-list-view';
import SortingView from '../view/sorting-view';

export default class Presenter {
  RoutePointListComponent = new RoutePointListView();

  constructor() {
    this.tripEvents = document.querySelector('.trip-events');
    this.tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new FiltersView(), this.tripControlFilters);
    render(new SortingView(), this.tripEvents);
    render(this.RoutePointListComponent, this.tripEvents);
    render(new EditFormView(), this.RoutePointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.RoutePointListComponent.getElement());
    }
    render(new CreateFormView(), this.RoutePointListComponent.getElement());
  }
}


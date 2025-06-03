import AbstractView from '../framework/view/abstract-view';
import { sortPointByDay, getRouteDates, getRoute, getRoutePrice } from '../utils.js';

export default class TripInfoView extends AbstractView {
  #points = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationModel = null;

  constructor(pointsModel, offersModel, destinationModel) {
    super();
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#points = pointsModel.points.sort(sortPointByDay);
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinationModel, this.#offersModel);
  }
}

function createTripInfoTemplate(points, destinationsModel, offersModel) {
  const routeDates = getRouteDates(points.reverse());
  const route = getRoute(points, destinationsModel);
  const routePrice = getRoutePrice(points, offersModel);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>
              <p class="trip-info__dates">${routeDates[0]}&nbsp;&mdash;&nbsp;${routeDates[1]}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${routePrice}</span>
            </p>
          </section>`;
}


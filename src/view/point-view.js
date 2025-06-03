import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeString, convertDate, getDuration} from '../utils.js';

export default class PointView extends AbstractView {
  pointModel;
  #offerModel;
  #destinationModel;
  #rollupButton;
  #favoriteButton;
  constructor(pointModel, offerModel, destinationModel, onEditButtonClick, onFavoriteButtonClick) {
    super();
    this.pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.#rollupButton.addEventListener('click', onEditButtonClick);
    this.#favoriteButton.addEventListener('click', onFavoriteButtonClick);
  }

  get template() {
    return createPointsTemplate(this.pointModel, this.#offerModel, this.#destinationModel);
  }
}

function createPointsTemplate(pointModel, offerModel, destinationModel) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    isFavorite,
    offers,
    type
  } = pointModel;

  const pointOffers = [];
  for (const offerId of offers) {
    pointOffers.push(offerModel.getOfferById(type, offerId));
  }
  const { name } = destinationModel.getDestinationById(destination);
  const date = convertDate(dateFrom);
  return `
            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${convertDate(dateFrom, 'YYYY-MM-DDTHH:mm')}">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${capitalizeString(type)} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${convertDate(dateFrom, 'YYYY-MM-DDTHH:mm')}">${convertDate(dateFrom, 'HH:mm')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${convertDate(dateTo, 'YYYY-MM-DDTHH:mm')}">${convertDate(dateTo, 'HH:mm')}</time>
                  </p>
                  <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${pointOffers.map((offer) => `
                    <li class="event__offer">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </li>
                  `).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite && 'event__favorite-btn--active'}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>
`;
}

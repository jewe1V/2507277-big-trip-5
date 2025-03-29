import { createElement } from '../render.js';
import { formatDate } from '../utils.js';

export default class EditFormView {
  constructor(event, destinationModel, offerModel) {
    this.event = event;
    this.destinationModel = destinationModel;
    this.offerModel = offerModel;
  }

  getTemplate() {
    return createFormTemplate(this.event, this.destinationModel, this.offerModel);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

function createFormTemplate(event, destinationModel, offerModel) {
  const { basePrice, dateFrom, dateTo, destination, type, offers: selectedOfferIds = [] } = event;

  const pointTypeIsChecked = (pointType) => (pointType === type ? 'checked' : '');
  const destinationData = destinationModel.getDestinationById(destination);
  const startDate = dateFrom ? formatDate(dateFrom) : '';
  const endDate = dateTo ? formatDate(dateTo) : '';
  const destinationName = destinationData.name || '';
  const destinationDescription = destinationData.description || '';
  const availableOffers = offerModel.getOffersByType(type);
  const offersTemplate = availableOffers
    .map((offer) => {
      const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
      const offerName = offer.title.toLowerCase().split(' ').join('-');
      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden"
                 id="event-offer-${offerName}-${offer.id}"
                 type="checkbox"
                 name="event-offer-${offerName}"
                 ${checked}>
          <label class="event__offer-label" for="event-offer-${offerName}-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            +€ <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
    })
    .join('');

  const destinations = destinationModel.getDestinations();
  const eventTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type || 'flight'}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypes
    .map(
      (eventType) => `
                    <div class="event__type-item">
                      <input id="event-type-${eventType}-1"
                             class="event__type-input visually-hidden"
                             type="radio"
                             name="event-type"
                             value="${eventType}"
                             ${pointTypeIsChecked(eventType)}>
                      <label class="event__type-label event__type-label--${eventType}"
                             for="event-type-${eventType}-1">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
                    </div>
                  `
    )
    .join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type || 'Flight'}
          </label>
          <input class="event__input event__input--destination"
                 id="event-destination-1"
                 type="text"
                 name="event-destination"
                 value="${destinationName}"
                 list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time"
                 id="event-start-time-1"
                 type="text"
                 name="event-start-time"
                 value="${startDate}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time"
                 id="event-end-time-1"
                 type="text"
                 name="event-end-time"
                 value="${endDate}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input event__input--price"
                 id="event-price-1"
                 type="text"
                 name="event-price"
                 value="${basePrice || ''}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${event.id ? 'Delete' : 'Cancel'}</button>
        ${event.id ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        ` : ''}
      </header>
      <section class="event__details">
        ${availableOffers.length ? `
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>
        ` : ''}
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>
        </section>
      </section>
    </form>
  `;
}

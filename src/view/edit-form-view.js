import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalizeString, convertDate, getOfferKeyword } from '../utils.js';
import {EVENT_TYPES} from '../consts';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

export default class EditFormView extends AbstractStatefulView {
  #allOffers;
  #allDestination;
  #onFormSubmit;
  #onEditButtonClick;
  #onDeletePoint;
  #datepickerStart;
  #datepickerEnd;
  #initialPoint;
  #isNewPoint = false;

  constructor(pointModel, offerModel, destinationModel, onFormSubmit, onDeletePoint, onEditButtonClick) {
    super();
    this.#initialPoint = pointModel;
    this._setState(this.parsePointToState(pointModel));
    this.#allOffers = offerModel;
    this.#allDestination = destinationModel;
    this.#onEditButtonClick = onEditButtonClick;
    this.#isNewPoint = onEditButtonClick === undefined;
    this.#onFormSubmit = onFormSubmit;
    this.#onDeletePoint = onDeletePoint;
    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#allOffers, this.#allDestination, this.#isNewPoint);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#onFormStateSubmit);
    if (!this.#isNewPoint) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditButtonClick);
    }
    this.element.querySelector('.event__type-group').addEventListener('change', (evt) => {
      this.#onTypeListChange(evt);
    });
    this.element.querySelector('.event__input--destination').addEventListener('change', (evt) => {
      this.#onCityChange(evt);
    });
    this.element.querySelector('.event__reset-btn').addEventListener('click', (evt) => {
      this.#onDeleteStateButton(evt);
    });
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    this.element.querySelectorAll('.event__offer-checkbox').forEach(
      (checkbox) => checkbox.addEventListener('change', this.#onOfferChange)
    );
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #setDatepickerStart = () => {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
    }
    this.#datepickerStart = flatpickr(this.element.querySelector('#event-start-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this._setState({
          dateFrom: selectedDates[0].toISOString()
        });
      }
    });
  };

  #setDatepickerEnd = () => {
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
    }
    this.#datepickerEnd = flatpickr(this.element.querySelector('#event-end-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: (selectedDates) => {
        this._setState({
          dateTo: selectedDates[0].toISOString()
        });
      }
    });
  };

  #onPriceInput = (evt) => {
    const price = parseInt(evt.target.value, 10);
    this._setState({
      basePrice: price
    });
  };

  #onOfferChange = (evt) => {
    const offerId = evt.target.dataset.offerId;
    const newOffers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);
    this._setState({
      offers: newOffers
    });
  };

  #onFormStateSubmit = (evt) => {
    evt.preventDefault();
    const point = EditFormView.parseStateToPoint(this._state);
    if (isNaN(point.basePrice) || point.basePrice <= 0 || !this._state.dateTo || !this._state.dateFrom
      || new Date(this._state.dateFrom) >= new Date(this._state.dateTo) || !point.destination) {
      this.shake();
      return;
    }
    this.#onFormSubmit(evt, point);
  };

  #onCityChange = (evt) => {
    const city = evt.target.value;
    const newDestination = this.#allDestination.destinations.find((destination) => (destination.name || '') === city)?.id;
    this.updateElement({
      destination: newDestination || null
    });
  };

  #onTypeListChange = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.getOfferByType(targetType);
    this.updateElement({
      type: targetType,
      typeOffers: typeOffers,
    });
  };

  #onDeleteStateButton = (evt) => {
    evt.preventDefault();
    if (this.#isNewPoint) {
      this.#onDeletePoint();
    } else {
      this.#onDeletePoint(EditFormView.parseStateToPoint(this._state));
    }
  };

  resetToInitialState() {
    this.updateElement(this.parsePointToState(this.#initialPoint));
  }

  parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}

function createFormTemplate(state, offerModel, destinationModel, isNewPoint) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isDisabled,
    isSaving,
    isDeleting,
  } = state;

  const pointOffers = offers.map((offerId) => offerModel.getOfferById(type, offerId));
  const allOffers = offerModel.getOfferByType(type).offers;
  const destinationData = destinationModel.getDestinationById(destination);
  const deleteText = isDeleting ? 'Deleting...' : 'Delete';

  const renderEventTypeItems = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio"
        name="event-type" value="${eventType}" ${type === eventType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeString(eventType)}</label>
    </div>
  `).join('');

  const renderOffers = allOffers?.length > 0 ? `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${allOffers.map((offer) => {
    const keyword = getOfferKeyword(offer.title);
    return `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden"
                id="event-offer-${keyword}-1"
                type="checkbox"
                name="event-offer-${keyword}"
                ${pointOffers.includes(offer) ? 'checked' : ''}
                data-offer-id="${offer.id}" ${isDisabled ? 'disabled' : ''}>
              <label class="event__offer-label" for="event-offer-${keyword}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  }).join('')}
      </div>
    </section>` : '';

  const renderDestination = (destinationData.description || destinationData.pictures?.length > 0) ? `
    <section class="event__section  event__section--destination">
      ${destinationData.description ? `
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationData.description}</p>` : ''}
      ${destinationData.pictures?.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destinationData.pictures.map((picture) => `
              <img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
          </div>
        </div>` : ''}
    </section>` : '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
                <legend class="visually-hidden">Event type</legend>
                ${renderEventTypeItems}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeString(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
              value="${he.encode(destinationData.name)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinationModel.destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${convertDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${convertDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
              value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${!isNewPoint ? deleteText : 'Cancel'}
          </button>
          ${!isNewPoint ? `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>` : ''}
        </header>
        <section class="event__details">
          ${renderOffers}
          ${renderDestination}
        </section>
      </form>
    </li>
  `;
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { convertDate } from '../utils.js';
import { Formats, EVENT_TYPES } from '../consts.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createPointTypesTemplate(type) {
  return EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input
        id="event-type-${eventType}-1"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>
  `).join('');
}

function createAvailableOffersTemplate(pointTypeOffers, offers) {
  return pointTypeOffers.offers.map((offer) => `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.title}-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.title}"
        data-id="${offer.id}"
        ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        +€
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

function createFormEditingTemplate(point, allOffers, destinations) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = point;
  const pointTypeOffers = allOffers.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((item) => item.id === destination);
  const renderDestinationsList = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
  const startDate = convertDate(dateFrom, Formats.FULL_DATE);
  const endDate = convertDate(dateTo, Formats.FULL_DATE);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypesTemplate(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${renderDestinationsList}
            </datalist>
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createAvailableOffersTemplate(pointTypeOffers, offers)}
            </div>
          </section>
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationInfo.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationInfo.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`;
}

export default class FormEditing extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleFormReset = null;
  #startDatePicker = null;
  #endDatePicker = null;

  constructor({ point, offers, destinations, onFormSubmit, onFormReset }) {
    super();
    this._setState(point);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;

    this._restoreHandlers();
  }

  get template() {
    return createFormEditingTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement() {
    super.removeElement();
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }
    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #formResetHandler = () => {
    this.#handleFormReset();
  };

  #pointTypeChangeHandler = (evt) => {
    if (evt.target.closest('input')) {
      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.checked) {
      this._setState({
        offers: [...this._state.offers, parseInt(evt.target.dataset.id, 10)],
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
      });
    }
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dateChangeHandler = ([startDate, endDate]) => {
    this._setState({
      dateFrom: startDate.toISOString(),
      dateTo: endDate ? endDate.toISOString() : startDate.toISOString(),
    });
  };

  #setupDatePickers() {
    const startDateInput = this.element.querySelector('#event-start-time-1');
    const endDateInput = this.element.querySelector('#event-end-time-1');

    this.#startDatePicker = flatpickr(startDateInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this.#endDatePicker.set('minDate', selectedDates[0]);
        this.#dateChangeHandler([selectedDates[0], new Date(this._state.dateTo)]);
      },
    });

    this.#endDatePicker = flatpickr(endDateInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this.#dateChangeHandler([new Date(this._state.dateFrom), selectedDates[0]]);
      },
    });
  }

  reset(point) {
    this.updateElement(point);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.#setupDatePickers();
  }
}

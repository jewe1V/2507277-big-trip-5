import AbstractView from '../framework/view/abstract-view.js';

export default class SortingView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler.bind(this));
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler(evt) {
    if (evt.target.matches('input[name="trip-sort"]')) {
      const sortType = evt.target.dataset.sortType;
      this.#handleSortTypeChange(sortType);
    }
  }
}

function createSortTemplate(currentSortType) {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      <div class="trip-sort__item trip-sort__item--day">
        <input
          id="sort-day"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-day"
          data-sort-type="day"
          ${currentSortType === 'day' ? 'checked' : ''}
        >
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item trip-sort__item--event">
        <input
          id="sort-event"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-event"
          data-sort-type="event"
          disabled
        >
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item trip-sort__item--time">
        <input
          id="sort-time"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-time"
          data-sort-type="time"
          ${currentSortType === 'time' ? 'checked' : ''}
        >
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item trip-sort__item--price">
        <input
          id="sort-price"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-price"
          data-sort-type="price"
          ${currentSortType === 'price' ? 'checked' : ''}
        >
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item trip-sort__item--offer">
        <input
          id="sort-offer"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-offer"
          data-sort-type="offer"
          disabled
        >
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>
  `;
}

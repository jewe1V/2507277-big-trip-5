import AbstractView from '../framework/view/abstract-view.js';

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters = [], currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler.bind(this));
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  }
}

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, count } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}" ${count === 0 ? 'disabled' : ''} ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
    </div>`
  );
}

function createFiltersTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

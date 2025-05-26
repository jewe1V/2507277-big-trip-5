import AbstractView from '../framework/view/abstract-view.js';

export default class FiltersView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;

  constructor({ filters = [], onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler.bind(this));
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  #filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  }
}

function createFilterItemTemplate(filter) {
  const { type, count } = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}" ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
    </div>`
  );
}

function createFiltersTemplate(filterItems) {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

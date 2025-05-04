import AbstractView from '../framework/view/abstract-view.js';

export default class FiltersView extends AbstractView {
  constructor(filters) {
    super();
    this.filters = filters;
  }

  get template(){
    return this.createFiltersTemplate();
  }

  createFiltersTemplate() {
    return `
    <form class="trip-filters" action="#" method="get">
      ${this.filters.map(({ name, isDisabled }) => `
        <div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${name}" ${isDisabled ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
        </div>
      `).join('')}
    </form>
  `;
  }
}


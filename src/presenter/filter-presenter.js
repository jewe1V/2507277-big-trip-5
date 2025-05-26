import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterType, UpdateType } from '../consts.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;
  }

  init() {
    const filters = this.#generateFilters();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      onFilterTypeChange: this.#handleFilterTypeChange.bind(this)
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #generateFilters() {
    const points = this.#pointModel.points;
    const currentDate = new Date();

    return Object.values(FilterType).map((type) => ({
      type,
      count: this.#getFilteredPoints(type, points, currentDate).length
    }));
  }

  #getFilteredPoints(filterType, points, currentDate) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        return points;
      case FilterType.PAST:
        return points.filter((point) => new Date(point.dateTo) < currentDate);
      case FilterType.PRESENT:
        return points.filter((point) => new Date(point.dateFrom) <= currentDate && new Date(point.dateTo) >= currentDate);
      case FilterType.FUTURE:
        return points.filter((point) => new Date(point.dateFrom) > currentDate);
      default:
        return points;
    }
  }

  #handleFilterTypeChange(filterType) {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.FILTER, filterType);
    this.#pointModel.setFilter(filterType);
  }
}

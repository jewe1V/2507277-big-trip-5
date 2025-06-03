import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterType, UpdateType } from '../consts.js';
import {filterPoints} from '../utils';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, pointModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  #onModelEvent = () => {
    this.init();
  };

  init() {
    const filters = this.#generateFilters();
    const prevFilterComponent = this.#filterComponent;
    const currentFilterType = this.#filterModel.filter;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType,
      onFilterTypeChange: this.#handleFilterTypeChange.bind(this)
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }
  }

  #generateFilters() {
    const points = this.#pointModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filterPoints[type](points).length
    }));
  }

  #handleFilterTypeChange(filterType) {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  }
}

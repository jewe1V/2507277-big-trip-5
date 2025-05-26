import { pointsMock } from '../mock/points-mock.js';
import { getAllDestinations, getAllOffers } from '../utils.js';
import Observable from '../framework/observable.js';
import { FilterType, UpdateType } from '../consts.js';

export default class PointModel extends Observable {
  #points = pointsMock;
  #allDestinations = getAllDestinations();
  #allOffers = getAllOffers();
  #currentFilter = FilterType.EVERYTHING;

  setFilter(filter) {
    this.#currentFilter = filter;
    this._notify(UpdateType.FILTER, filter);
  }

  get points() {
    const currentDate = new Date();

    switch (this.#currentFilter) {
      case FilterType.EVERYTHING:
        return [...this.#points];
      case FilterType.PAST:
        return [...this.#points].filter((point) => new Date(point.dateTo) < currentDate);
      case FilterType.PRESENT:
        return [...this.#points].filter((point) => new Date(point.dateFrom) <= currentDate && new Date(point.dateTo) >= currentDate);
      case FilterType.FUTURE:
        return [...this.#points].filter((point) => new Date(point.dateFrom) > currentDate);
      default:
        return [...this.#points];
    }
  }

  get destinations() {
    return [...this.#allDestinations];
  }

  get offers() {
    return [...this.#allOffers];
  }

  getAllDestinations() {
    return [...this.#allDestinations];
  }

  updateDestination(updateType, update) {
    const index = this.#allDestinations.findIndex((dest) => dest.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting destination');
    }

    this.#allDestinations = [
      ...this.#allDestinations.slice(0, index),
      update,
      ...this.#allDestinations.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addDestination(updateType, update) {
    this.#allDestinations = [
      update,
      ...this.#allDestinations
    ];

    this._notify(updateType, update);
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}


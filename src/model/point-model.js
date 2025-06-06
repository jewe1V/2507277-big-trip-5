import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';

export default class PointModel extends Observable {
  #points = [];
  #pointsApiService = null;
  #isLoading = true;
  #isLoadingFailed = false;

  constructor(pointApiService) {
    super();
    this.#pointsApiService = pointApiService;
  }

  get points() {
    return [...this.#points];
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isLoadingFailed() {
    return this.#isLoadingFailed;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptPointToClient);
    } catch (e) {
      this.#isLoadingFailed = true;
      this.#points = [];
    }
    this.#isLoading = false;
    this._notify(UpdateType.INIT, { isLoadingFailed: this.#isLoadingFailed });
  }

  async updatePoints(updateType, update) {
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptPointToClient(response);
      const index = this.#points.findIndex((point) => point.id === update.id);
      this.#points = [...this.#points.slice(0, index), updatedPoint, ...this.#points.slice(index + 1)];
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error(`Ошибка при обновлении точки: ${error.message}`);
    }
  }

  async addPoints(updateType, point) {
    try {
      const response = await this.#pointsApiService.addPoint(point);
      const update = this.#adaptPointToClient(response);
      this.#points = [update, ...this.#points];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error(`Ошибка при добавлении точки: ${error.message}`);
    }
  }

  async deletePoints(updateType, update) {
    try {
      await this.#pointsApiService.deletePoint(update);
      const index = this.#points.findIndex((point) => point.id === update.id);
      this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error(`Ошибка при удалении точки: ${error.message}`);
    }
  }

  #adaptPointToClient(point) {
    return {
      id: point.id,
      type: point.type,
      destination: point.destination,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      basePrice: point.base_price,
      offers: point.offers,
      isFavorite: point.is_favorite
    };
  }
}

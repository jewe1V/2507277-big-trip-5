import ApiService from '../framework/api-service.js';
import { Method } from '../consts.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedTask = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
      'destination': point.destination.toString()
    };

    delete adaptedTask.dateTo;
    delete adaptedTask.dateFrom;
    delete adaptedTask.basePrice;
    delete adaptedTask.isFavorite;
    delete adaptedTask.typeOffers;
    return adaptedTask;
  }
}

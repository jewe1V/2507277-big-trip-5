import Observable from '../framework/observable.js';
import {UpdateType} from '../consts.js';

export default class DestinationModel extends Observable {
  #destinations = [];
  #destinationApiService = null;
  #isLoading = true;
  #isLoadingFailed = false;

  constructor(destinationApiService) {
    super();
    this.#destinationApiService = destinationApiService;
  }

  get destinations() {
    return [...this.#destinations];
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id) || { name: '', description: '', pictures: [] };
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isLoadingFailed() {
    return this.#isLoadingFailed;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationApiService.destinations;
    } catch (e) {
      this.#destinations = [];
      this.#isLoadingFailed = true;
    }
    this.#isLoading = false;
    this._notify(UpdateType.INIT, { isLoadingFailed: this.#isLoadingFailed });
  }
}

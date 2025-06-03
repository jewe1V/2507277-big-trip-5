import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';

export default class OfferModel extends Observable {
  #offers = [];
  #offersApiService = null;
  #isLoading = true;
  #isLoadingFailed = false;

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (e) {
      this.#offers = [];
      this.#isLoadingFailed = true;
    }
    this.#isLoading = false;
    this._notify(UpdateType.INIT, { isLoadingFailed: this.#isLoadingFailed });
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isLoadingFailed() {
    return this.#isLoadingFailed;
  }

  get offers() {
    return this.#offers;
  }

  getOfferByType(type) {
    return this.#offers.find((offer) => offer.type === type) || { type, offers: [] };
  }

  getOfferById(type, id) {
    const typeOffers = this.getOfferByType(type);
    return typeOffers.offers.find((offer) => offer.id === id) || null;
  }
}

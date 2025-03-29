import {offersMock} from '../mock/offers-mock.js';

const FIRST_ELEMENT = 0;
export default class OffersModel {
  offers = [... offersMock];

  getOffers() {
    return this.offers;
  }

  getOffersById(type, id) {
    const offers = this.offers.filter((offer) => offer.type === type)[FIRST_ELEMENT].offers.find((item) => item.id === id);
    return offers ? offers.offers : [];
  }

  getOffersByType(type) {
    const typeOffers = this.offers.find((offer) => offer.type === type);
    return typeOffers ? typeOffers.offers : [];
  }
}

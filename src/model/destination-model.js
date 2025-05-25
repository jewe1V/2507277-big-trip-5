import {destinationsMock} from '../mock/destination-mock.js';

export default class DestinationModel {
  get destinations() {
    return [... destinationsMock];
  }

  getDestinationById(id) {
    return this.destinations.find((item) => item.id === id);
  }
}

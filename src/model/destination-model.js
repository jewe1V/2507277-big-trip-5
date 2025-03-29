import {destinationsMock} from '../mock/destination-mock.js';

export default class DestinationModel {
  destinations = [... destinationsMock];

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((item) => item.id === id);
  }
}

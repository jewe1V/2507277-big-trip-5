import { EventsMock } from '../mock/event-mock.js';

export default class EventModel {
  events = [... EventsMock];

  getEvents() {
    return this.events;
  }
}

import { isPointFuture, isPointPast, isPointPresent } from './utils';

const Formats = {
  TIME: 'HH:mm',
  DAY: 'MMM D',
  FULL_DATE: 'D/MM/YY HH:mm',
  TIME_TAG_VALUE: 'YYYY-MM-DD'
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
  EVENT: 'event',
  OFFER: 'offer'
};

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const UpdateType = {
  PATCH: 'PATCH',
  MAJOR: 'MAJOR',
  DESTINATION: 'DESTINATION',
  FILTER: 'FILTER'
};

const EmptyListMessages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const EditFormType = {
  EDIT: 'EDIT',
  ADD: 'ADD'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export { Formats, filter, Mode, SortType, EVENT_TYPES, UpdateType, FilterType, EmptyListMessages, UserAction, EditFormType, Method };

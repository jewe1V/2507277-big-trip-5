import { isPointFuture, isPointPast, isPointPresent } from './utils';

const Formats = {
  TIME: 'HH:mm',
  DAY: 'MMM D',
  FULL_DATE: 'D/MM/YY HH:mm',
  TIME_TAG_VALUE: 'YYYY-MM-DD'
};

const Filter = {
  'everything': (points) => [...points],
  'future': (points) => points.filter((point) => isPointFuture(point)),
  'present': (points) => points.filter((point) => isPointPresent(point)),
  'past': (points) => points.filter((point) => isPointPast(point))
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

export { Formats, Filter, Mode, SortType, EVENT_TYPES };

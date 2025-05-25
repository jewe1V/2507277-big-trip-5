import { getRandomInt } from '../utils';
const MIN_PRICE = 1000;
const MAX_PRICE = 5000;

const PointsMock = [
  {
    id: 1,
    basePrice: getRandomInt(MIN_PRICE,MAX_PRICE),
    dateFrom: '2025-07-10T22:55:00.000Z',
    dateTo: '2025-07-11T11:22:00.000Z',
    destination: 1,
    isFavorite: false,
    offers: [1, 2, 3],
    type: 'taxi'
  },
  {
    id: 2,
    basePrice: getRandomInt(MIN_PRICE,MAX_PRICE),
    dateFrom: '2025-03-10T14:30:00.000Z',
    dateTo: '2025-03-10T18:45:00.000Z',
    destination: 2,
    isFavorite: true,
    offers: [4, 5, 6],
    type: 'flight'
  },
  {
    id: 3,
    basePrice: getRandomInt(MIN_PRICE,MAX_PRICE),
    dateFrom: '2025-04-15T09:00:00.000Z',
    dateTo: '2025-04-15T10:15:00.000Z',
    destination: 3,
    isFavorite: false,
    offers: [7, 8],
    type: 'check-in'
  },
  {
    id: 4,
    basePrice: getRandomInt(MIN_PRICE,MAX_PRICE),
    dateFrom: '2025-05-20T07:25:00.000Z',
    dateTo: '2025-05-20T19:40:00.000Z',
    destination: 4,
    isFavorite: true,
    offers: [],
    type: 'sightseeing'
  }
];

export { PointsMock };

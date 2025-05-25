import { getRandomInt } from '../utils';
const MIN_PRICE = 10;
const MAX_PRICE = 100;

const offersMock = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 2,
        title: 'Add meal',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 3,
        title: 'Choose a premium car',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 4,
        title: 'Add extra luggage',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 5,
        title: 'Priority boarding',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 6,
        title: 'Select seat',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 7,
        title: 'Early check-in',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 8,
        title: 'Late check-out',
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: []
  }
];

export { offersMock };

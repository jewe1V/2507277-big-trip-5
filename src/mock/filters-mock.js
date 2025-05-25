import { filter } from '../consts';

function generateFilter(points) {
  return Object.entries(filter).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length
  }));
}

export { generateFilter };

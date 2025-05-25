import { Filter } from '../consts';

function generateFilter(points) {
  return Object.entries(Filter).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length
  }));
}

export { generateFilter };

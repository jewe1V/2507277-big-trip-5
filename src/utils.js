import dayjs from 'dayjs';
import {FilterType} from './consts';

const DATE_FORMAT = 'D MMM';

function convertDate(date, format = DATE_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function getDuration(dateFrom, dateTo){
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  if (difference > (60 * 24)) {
    const days = Math.floor(difference / (60 * 24));
    const remainder = difference % (60 * 24);
    const hours = Math.floor(remainder / 60);
    const minutes = remainder % 60;
    return `${String(days).padStart(2,'0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (difference > 60){
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    return `${String(hours).padStart(2,'0')}H ${String(minutes).padStart(2,'0')}M`;
  } else {
    return `${String(difference).padStart(2,'0')}M`;
  }
}

function capitalizeString(word){
  return word[0].toUpperCase() + word.slice(1);
}


function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function getOfferKeyword(title){
  return title.split(' ').slice(-1);
}


function isPointPresent(point) {
  return dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));
}

function isPointFuture(point) {
  return dayjs().isBefore(dayjs(point.dateFrom));
}

function isPointPast(point) {
  return dayjs().isAfter(dayjs(point.dateTo));
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

function sortPointByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPointByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

const getDayAndMonth = (date) => dayjs(date).format('D MMM');

const getRouteDates = (points) => [getDayAndMonth(points[points.length - 1].dateFrom), getDayAndMonth(points[0].dateTo)];

const getRoute = (points, destinationModel) => {
  const route = points.map((point) => destinationModel.getDestinationById(point.destination).name);
  return route.length < 4 ? route.join(' &mdash; ') : `${route[route.length - 1]} &mdash; ... &mdash; ${route[0]}`;
};

const getRoutePrice = (points, offerModel) => {
  const basePrice = points.reduce((sum, point) => sum + Number(point.basePrice), 0);

  const additionalPrice = points.reduce((sum, point) => {
    const offersForType = offerModel.getOfferByType(point.type);
    const selectedOffers = point.offers.map((offerId) =>
      offersForType.offers.find((offer) => offer.id === offerId)
    );
    const offersSum = selectedOffers.reduce(
      (acc, offer) => acc + (offer ? Number(offer.price) : 0), 0
    );
    return sum + offersSum;
  }, 0);

  return basePrice + additionalPrice;
};

const filterPoints = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter((point) => new Date(point.dateTo) < new Date()),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) =>
      new Date(point.dateFrom) <= new Date() && new Date(point.dateTo) >= new Date()
    ),
  [FilterType.FUTURE]: (points) => points.filter((point) => new Date(point.dateFrom) > new Date())
};

export { convertDate, getDuration,getOfferKeyword, capitalizeString, isEscapeKey,
  isPointPresent, isPointFuture, isPointPast, isDatesEqual,
  sortPointByTime, sortPointByDay, getRouteDates, getRoute, getRoutePrice, filterPoints};

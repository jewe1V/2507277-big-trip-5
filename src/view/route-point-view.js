import { createElement } from '../render.js';

export default class RoutePointView {
  constructor(event, destination, offers) {
    this.event = event || {};
    this.destination = destination || {};
    this.offers = offers || [];
  }

  getTemplate() {
    return createPointsTemplate(this.event, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

function createPointsTemplate(event, destination, offers) {
  const { basePrice = '', dateFrom = '', dateTo = '', type = 'flight', isFavorite = false, offers: selectedOfferIds = [] } = event;
  const { name: destinationName = '' } = destination;

  // Форматирование даты и времени (предполагаем, что dateFrom и dateTo в формате ISO или 'D/MM/YY HH:mm')
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  const day = startDate.getUTCDate() || '';
  const dayValue = dateFrom.split('T')[0] || dateFrom.split(' ')[0] || '';
  const timeStart = dateFrom.split(' ')[1] || dateFrom.split('T')[1]?.slice(0, 5) || '';
  const timeEnd = dateTo.split(' ')[1] || dateTo.split('T')[1]?.slice(0, 5) || '';

  // Вычисление длительности (примерно)
  const durationMs = endDate - startDate;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

  // Формирование списка выбранных предложений
  const selectedOffers = offers
    .filter((offer) => selectedOfferIds.includes(offer.id))
    .map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `)
    .join('');

  // Класс для кнопки избранного
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayValue}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeStart}</time>
            —
            <time class="event__end-time" datetime="${dateTo}">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          € <span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffers}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
      </div>
    </li>
  `;
}

import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offer-model';
import CreatePointView from './view/create-point-view.js';
import PointApiService from './api-service/point-api-service.js';
import OfferApiService from './api-service/offer-api-service.js';
import DestinationApiService from './api-service/destination-api-service.js';
import { render, RenderPosition } from './framework/render.js';
import {END_POINT, AUTHORIZATION_TOKEN} from './consts';


const pointModel = new PointModel(new PointApiService(END_POINT, AUTHORIZATION_TOKEN));
const offerModel = new OfferModel(new OfferApiService(END_POINT, AUTHORIZATION_TOKEN));
const destinationModel = new DestinationModel(new DestinationApiService(END_POINT, AUTHORIZATION_TOKEN));
const filterModel = new FilterModel();

const newPointButtonComponent = new CreatePointView(onNewPointButtonClick);
const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main');

const mainPresenter = new MainPresenter(
  eventsContainer,
  pointModel,
  offerModel,
  destinationModel,
  filterModel,
  onNewPointFormClose
);

const filterPresenter = new FilterPresenter(
  filtersContainer,
  filterModel,
  pointModel
);

const tripInfoPresenter = new TripInfoPresenter(
  tripInfoContainer,
  pointModel,
  offerModel,
  destinationModel
);

Promise.all([
  pointModel.init(),
  offerModel.init(),
  destinationModel.init()
]).then(() => {
  render(newPointButtonComponent, tripInfoContainer, RenderPosition.BEFOREEND);
  tripInfoPresenter.init();
  filterPresenter.init();
  mainPresenter.init();
  if (pointModel.isLoadingFailed || offerModel.isLoadingFailed || destinationModel.isLoadingFailed) {
    newPointButtonComponent.element.disabled = true;
  }
});

function onNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function onNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offers-model';

const pointModel = new PointModel();
const destinationModel = new DestinationModel();
const offerModel = new OfferModel();

const presenter = new MainPresenter({pointModel, offerModel, destinationModel});

presenter.init();

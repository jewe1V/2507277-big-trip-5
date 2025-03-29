import Presenter from './presenter/presenter';
import EventModel from './model/event-model';
import DestinationModel from './model/destination-model';
import OfferModel from './model/offers-model';

const eventModel = new EventModel();
const destinationModel = new DestinationModel();
const offerModel = new OfferModel();

const presenter = new Presenter(destinationModel,eventModel, offerModel);

presenter.init();

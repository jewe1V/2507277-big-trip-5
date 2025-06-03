import { remove, render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationModel = null;
  #tripInfoComponent = null;

  constructor(container, pointsModel, offersModel, destinationModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    remove(this.#tripInfoComponent);
    this.#tripInfoComponent = new TripInfoView(
      this.#pointsModel,
      this.#offersModel,
      this.#destinationModel
    );
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModelChange = () => {
    this.init();
  };
}

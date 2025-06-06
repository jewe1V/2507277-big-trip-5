import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../consts.js';
import { sortPointByDay, sortPointByTime} from '../utils';
import {filter} from '../consts.js';
import PointListView from '../view/point-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortingView from '../view/sorting-view.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


export default class MainPresenter {
  #pointModel;
  #offerModel;
  #destinationModel;
  #filterModel;
  #bigContainer;
  #listContainer;
  #newPointPresenter;
  #pointsPresenters = new Map();
  #sortComponent = null;
  #actualSortType = SortType.DAY;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(container, pointModel, offerModel, destinationModel, filterModel, onNewPointDestroy) {
    const pointListView = new PointListView();
    const tripEventsList = pointListView.element;
    container.appendChild(tripEventsList);

    this.#bigContainer = container;
    this.#listContainer = tripEventsList;

    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#destinationModel = destinationModel;

    this.#pointModel.addObserver(this.#onModelEvent);
    this.#offerModel.addObserver(this.#onModelEvent);
    this.#destinationModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);

    this.#newPointPresenter = new NewPointPresenter(
      tripEventsList,
      this.#onViewAction,
      onNewPointDestroy
    );
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = [...filter[filterType](points)];
    switch (this.#actualSortType) {
      case SortType.DAY:
        filteredPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        filteredPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }
    return filteredPoints;
  }

  get offerModel() {
    return this.#offerModel;
  }

  get destinationModel() {
    return this.#destinationModel;
  }

  get container() {
    return this.#listContainer;
  }

  init() {
    this.#renderPoints();
  }

  createPoint = () => {
    this.#actualSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#offerModel, this.#destinationModel);
  };

  #onSortTypeChange = (changeSortType) => {
    if (changeSortType === this.#actualSortType) {
      return;
    }
    this.#actualSortType = changeSortType;
    this.#clearPointList({ resetRenderedPointCount: true });
    this.#renderPoints();
  };

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortingView({ currentSortType: this.#actualSortType, onSortTypeChange: this.#onSortTypeChange });
    render(this.#sortComponent, this.#bigContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoints() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const pointsCount = this.points.length;
    if (pointsCount === 0) {
      render(new ListEmptyView(this.#filterModel.filter), this.#listContainer, RenderPosition.AFTEREND);
      return;
    }
    this.#renderSort();
    for (let i = 0; i < pointsCount; i++) {
      const pointPresenter = new PointPresenter(
        this.container,
        this.offerModel,
        this.destinationModel,
        this.#onViewAction,
        this.#onModeChange);
      pointPresenter.init(this.points[i]);
      this.#pointsPresenters.set(this.points[i].id, pointPresenter);
    }
  }

  #clearPointList({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (resetSortType) {
      this.#actualSortType = SortType.DAY;
    }
  }

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoints(updateType, update);
        } catch (err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoints(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoints(updateType, update);
        } catch (err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #onModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetRenderedPointCount: true, resetSortType: true});
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        if (update.isLoadingFailed) {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderError();
        } else if (!this.#pointModel.isLoading && !this.#offerModel.isLoading && !this.#destinationModel.isLoading) {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderPoints();
        }
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderError() {
    render(this.#errorComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }
}


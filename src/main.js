import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const pointModel = new PointModel();
const filterModel = new FilterModel();

const presenter = new MainPresenter({pointModel, filterModel});
const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  filterModel,
  pointModel
});

presenter.init();
filterPresenter.init();

import { PointsMock } from '../mock/points-mock.js';

export default class PointModel {
  get points() {
    return [... PointsMock];
  }
}

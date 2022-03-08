import {Land} from "../../interfaces/land";

export class SetLandSelected {
  static readonly type = '[Land] Set Land selected';

  constructor(public payload: Land) {
  }
}

export class ClearLandState {
  static readonly type = '[Land] Clear State';

  constructor() {
  }
}

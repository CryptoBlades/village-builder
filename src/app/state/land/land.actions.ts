import {Land} from "../../interfaces/land";
import {Building} from "../../app.component";

export class SetLandSelected {
  static readonly type = '[Land] Set Land selected';

  constructor(public payload: Land) {
  }
}

export class SetBuildings {
  static readonly type = '[Land] Set Buildings';

  constructor(public payload: Building[]) {
  }
}

export class ClearLandState {
  static readonly type = '[Land] Clear State';

  constructor() {
  }
}

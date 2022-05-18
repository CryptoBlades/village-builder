import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {ClearLandState, SetBuildings, SetLandSelected} from './land.actions';
import {Land} from "../../interfaces/land";
import {Building} from "../../app.component";


function createInitialData(): LandStateModel {
  return {
    selectedLand: undefined,
    buildings: [],
  };
}

export interface LandStateModel {
  selectedLand?: Land;
  buildings: Building[];
}

@State<LandStateModel>({
  name: 'land',
  defaults: createInitialData()
})

@Injectable()
export class LandState {

  @Action(SetLandSelected)
  setSelectedLand({patchState}: StateContext<LandStateModel>, {payload}: SetLandSelected) {
    patchState({selectedLand: payload});
  }

  @Action(SetBuildings)
  setBuildings({patchState}: StateContext<LandStateModel>, {payload}: SetBuildings) {
    patchState({buildings: payload});
  }

  @Action(ClearLandState)
  clearState({patchState}: StateContext<LandStateModel>) {
    patchState({
      selectedLand: undefined,
    });
  }
}

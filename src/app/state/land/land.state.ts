import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ClearLandState, SetLandSelected} from './land.actions';
import {Land} from "../../interfaces/land";


function createInitialData(): LandStateModel {
  return {
    selectedLand: undefined,
  };
}

export interface LandStateModel {
  selectedLand?: Land;
}

@State<LandStateModel>({
  name: 'land',
  defaults: createInitialData()
})

@Injectable()
export class LandState {

  @Selector()
  static selectedLand(state: LandStateModel) {
    return state.selectedLand;
  }

  @Action(SetLandSelected)
  setSelectedLand({patchState}: StateContext<LandStateModel>, {payload}: SetLandSelected) {
    patchState({selectedLand: payload});
  }

  @Action(ClearLandState)
  clearState({patchState}: StateContext<LandStateModel>) {
    patchState({
      selectedLand: undefined,
    });
  }
}


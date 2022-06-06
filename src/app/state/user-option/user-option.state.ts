import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {UpdateUserOption} from './user-option.action';


export const languageCode = {
  US: 'en-US',
};

export interface UserOptionStateModel {
  language: string
}

function createInitialData(): UserOptionStateModel {
  return {
    language: languageCode.US,
  };
}

@State<UserOptionStateModel>({
  name: 'userOption',
  defaults: createInitialData()
})

@Injectable()
export class UserOptionState {

  @Action(UpdateUserOption)
  updateUserOption({patchState, getState}: StateContext<UserOptionStateModel>, {payload}: UpdateUserOption) {
    getState();
    patchState({
      ...getState(),
      ...payload
    });
  }
}


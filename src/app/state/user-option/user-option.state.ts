import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { UpdateUserOption } from './user-option.action';


export const languageCode = {
  US: 'en-US',
  German: 'de-DE',
  Spanish: 'es-ES',
  French: 'fr-FR'
};

export interface UserOptionStateModel {
  profanityfilter: boolean,
  priceInUSD: boolean,
  animations: boolean,
  language: string
}

function createInitialData(): UserOptionStateModel {
  return {
    profanityfilter: false,
    animations: false,
    language: languageCode.US,
    priceInUSD: false
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


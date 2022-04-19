import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ClearWalletState, SetKingBalance, SetMetamaskInstalled, SetWalletAddress} from './wallet.actions';


function createInitialData(): WalletStateModel {
  return {
    publicAddress: '',
    kingBalance: 0,
    isConnected: false,
    isInstalled: false,
  };
}

export interface WalletStateModel {
  publicAddress: string;
  kingBalance: number;
  isConnected: boolean;
  isInstalled: boolean;
}

@State<WalletStateModel>({
  name: 'wallet',
  defaults: createInitialData()
})

@Injectable()
export class WalletState {

  @Selector()
  static publicAddress(state: WalletStateModel) {
    return state.publicAddress;
  }

  @Selector()
  static isConnected(state: WalletStateModel) {
    return state.isConnected;
  }

  @Action(SetWalletAddress)
  setWalletAddress({patchState}: StateContext<WalletStateModel>, {payload}: SetWalletAddress) {
    patchState({publicAddress: payload, isConnected: true});
  }

  @Action(SetKingBalance)
  setKingBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetKingBalance) {
    patchState({kingBalance: payload});
  }

  @Action(SetMetamaskInstalled)
  setMetamaskInstalled({patchState}: StateContext<WalletStateModel>, {payload}: SetMetamaskInstalled) {
    patchState({isInstalled: payload});
  }

  @Action(ClearWalletState)
  clearState({patchState}: StateContext<WalletStateModel>) {
    patchState({
      publicAddress: ''
    });
  }
}


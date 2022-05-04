import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  ClearWalletState,
  SetCharactersBalance,
  SetSkillClayBalance,
  SetKingBalance,
  SetMetamaskInstalled,
  SetSkillBalance,
  SetSkillStoneBalance,
  SetWalletAddress,
  SetWeaponsBalance,
  SetSkillWoodBalance, SetWeaponsClayBalance, SetWeaponsWoodBalance, SetWeaponsStoneBalance
} from './wallet.actions';


function createInitialData(): WalletStateModel {
  return {
    publicAddress: '',
    kingBalance: 0,
    skillBalance: 0,
    weaponsBalance: 0,
    charactersBalance: 0,
    claySkillBalance: 0,
    woodSkillBalance: 0,
    stoneSkillBalance: 0,
    clayWeaponsBalance: 0,
    woodWeaponsBalance: 0,
    stoneWeaponsBalance: 0,
    isConnected: false,
    isInstalled: false,
  };
}

export interface WalletStateModel {
  publicAddress: string;
  kingBalance: number;
  skillBalance: number;
  weaponsBalance: number;
  charactersBalance: number;
  claySkillBalance: number;
  woodSkillBalance: number;
  stoneSkillBalance: number;
  clayWeaponsBalance: number;
  woodWeaponsBalance: number;
  stoneWeaponsBalance: number;
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

  @Action(SetSkillBalance)
  setSkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillBalance) {
    patchState({skillBalance: payload});
  }

  @Action(SetWeaponsBalance)
  setWeaponsBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsBalance) {
    patchState({weaponsBalance: payload});
  }

  @Action(SetCharactersBalance)
  setCharactersBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetCharactersBalance) {
    patchState({charactersBalance: payload});
  }

  @Action(SetSkillClayBalance)
  setClaySkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillClayBalance) {
    patchState({claySkillBalance: payload});
  }

  @Action(SetWeaponsClayBalance)
  setWeaponsClayBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsClayBalance) {
    patchState({clayWeaponsBalance: payload});
  }

  @Action(SetSkillWoodBalance)
  setWoodSkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillWoodBalance) {
    patchState({woodSkillBalance: payload});
  }

  @Action(SetWeaponsWoodBalance)
  setWeaponsWoodBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsWoodBalance) {
    patchState({woodWeaponsBalance: payload});
  }

  @Action(SetSkillStoneBalance)
  setStoneSkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillStoneBalance) {
    patchState({stoneSkillBalance: payload});
  }

  @Action(SetWeaponsStoneBalance)
  setWeaponsStoneBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsStoneBalance) {
    patchState({stoneWeaponsBalance: payload});
  }

  @Action(SetMetamaskInstalled)
  setMetamaskInstalled({patchState}: StateContext<WalletStateModel>, {payload}: SetMetamaskInstalled) {
    patchState({isInstalled: payload});
  }

  @Action(ClearWalletState)
  clearState({patchState}: StateContext<WalletStateModel>) {
    patchState({
      publicAddress: '',
      kingBalance: 0,
      skillBalance: 0,
      weaponsBalance: 0,
      charactersBalance: 0
    });
  }
}


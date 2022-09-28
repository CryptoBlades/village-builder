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
  SetSkillWoodBalance,
  SetWeaponsClayBalance,
  SetWeaponsWoodBalance,
  SetWeaponsStoneBalance,
  SetPaladinBalance,
  SetArcherBalance,
  SetMageBalance,
  SetSpearmanBalance,
  SetMercenaryBalance,
  SetLands,
  SetMercenaryUnlocksBalance,
  SetSpearmanUnlocksBalance,
  SetMageUnlocksBalance,
  SetArcherUnlocksBalance,
  SetPaladinUnlocksBalance,
  SetSkillClayUnlocksBalance,
  SetSkillWoodUnlocksBalance,
  SetWeaponsWoodUnlocksBalance,
  SetWeaponsClayUnlocksBalance,
  SetSkillStoneUnlocksBalance, SetWeaponsStoneUnlocksBalance
} from './wallet.actions';
import {Land} from "../../interfaces/land";


function createInitialData(): WalletStateModel {
  return {
    publicAddress: '',
    lands: [],
    isConnected: false,
    isInstalled: false,
  };
}

export interface WalletStateModel {
  publicAddress: string;
  lands: Land[];
  kingBalance?: number;
  skillBalance?: number;
  weaponsBalance?: number;
  charactersBalance?: number;
  claySkillBalance?: number;
  claySkillUnlocksBalance?: number;
  woodSkillBalance?: number;
  woodSkillUnlocksBalance?: number;
  stoneSkillBalance?: number;
  stoneSkillUnlocksBalance?: number;
  clayWeaponsBalance?: number;
  clayWeaponsUnlocksBalance?: number;
  woodWeaponsBalance?: number;
  woodWeaponsUnlocksBalance?: number;
  stoneWeaponsBalance?: number;
  stoneWeaponsUnlocksBalance?: number;
  mercenaryBalance?: number;
  mercenaryUnlocksBalance?: number;
  spearmanBalance?: number;
  spearmanUnlocksBalance?: number;
  mageBalance?: number;
  mageUnlocksBalance?: number;
  archerBalance?: number;
  archerUnlocksBalance?: number;
  paladinBalance?: number;
  paladinUnlocksBalance?: number;
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

  @Action(SetLands)
  setLands({patchState}: StateContext<WalletStateModel>, {payload}: SetLands) {
    patchState({lands: payload});
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

  @Action(SetSkillClayUnlocksBalance)
  setClaySkillUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillClayUnlocksBalance) {
    patchState({claySkillUnlocksBalance: payload});
  }

  @Action(SetWeaponsClayBalance)
  setWeaponsClayBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsClayBalance) {
    patchState({clayWeaponsBalance: payload});
  }

  @Action(SetWeaponsClayUnlocksBalance)
  setWeaponsClayUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsClayUnlocksBalance) {
    patchState({clayWeaponsUnlocksBalance: payload});
  }

  @Action(SetSkillWoodBalance)
  setWoodSkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillWoodBalance) {
    patchState({woodSkillBalance: payload});
  }

  @Action(SetSkillWoodUnlocksBalance)
  setWoodSkillUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillWoodUnlocksBalance) {
    patchState({woodSkillUnlocksBalance: payload});
  }

  @Action(SetWeaponsWoodBalance)
  setWeaponsWoodBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsWoodBalance) {
    patchState({woodWeaponsBalance: payload});
  }

  @Action(SetWeaponsWoodUnlocksBalance)
  setWeaponsWoodUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsWoodUnlocksBalance) {
    patchState({woodWeaponsUnlocksBalance: payload});
  }

  @Action(SetSkillStoneBalance)
  setStoneSkillBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillStoneBalance) {
    patchState({stoneSkillBalance: payload});
  }

  @Action(SetSkillStoneUnlocksBalance)
  setStoneSkillUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSkillStoneUnlocksBalance) {
    patchState({stoneSkillUnlocksBalance: payload});
  }

  @Action(SetWeaponsStoneBalance)
  setWeaponsStoneBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsStoneBalance) {
    patchState({stoneWeaponsBalance: payload});
  }

  @Action(SetWeaponsStoneUnlocksBalance)
  setWeaponsStoneUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetWeaponsStoneUnlocksBalance) {
    patchState({stoneWeaponsUnlocksBalance: payload});
  }

  @Action(SetMercenaryBalance)
  setMercenaryBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetMercenaryBalance) {
    patchState({mercenaryBalance: payload});
  }

  @Action(SetSpearmanBalance)
  setSpearmanBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSpearmanBalance) {
    patchState({spearmanBalance: payload});
  }

  @Action(SetMageBalance)
  setMageBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetMageBalance) {
    patchState({mageBalance: payload});
  }

  @Action(SetArcherBalance)
  setArcherBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetArcherBalance) {
    patchState({archerBalance: payload});
  }

  @Action(SetPaladinBalance)
  setPaladinBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetPaladinBalance) {
    patchState({paladinBalance: payload});
  }

  @Action(SetMercenaryUnlocksBalance)
  setMercenaryUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetMercenaryUnlocksBalance) {
    patchState({mercenaryUnlocksBalance: payload});
  }

  @Action(SetSpearmanUnlocksBalance)
  setSpearmanUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetSpearmanUnlocksBalance) {
    patchState({spearmanUnlocksBalance: payload});
  }

  @Action(SetMageUnlocksBalance)
  setMageUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetMageUnlocksBalance) {
    patchState({mageUnlocksBalance: payload});
  }

  @Action(SetArcherUnlocksBalance)
  setArcherUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetArcherUnlocksBalance) {
    patchState({archerUnlocksBalance: payload});
  }

  @Action(SetPaladinUnlocksBalance)
  setPaladinUnlocksBalance({patchState}: StateContext<WalletStateModel>, {payload}: SetPaladinUnlocksBalance) {
    patchState({paladinUnlocksBalance: payload});
  }

  @Action(SetMetamaskInstalled)
  setMetamaskInstalled({patchState}: StateContext<WalletStateModel>, {payload}: SetMetamaskInstalled) {
    patchState({isInstalled: payload});
  }

  @Action(ClearWalletState)
  clearState({patchState}: StateContext<WalletStateModel>) {
    patchState({
      publicAddress: '',
      isInstalled: false,
      isConnected: false,
      kingBalance: undefined,
      skillBalance: undefined,
      weaponsBalance: undefined,
      charactersBalance: undefined,
      claySkillBalance: undefined,
      woodSkillBalance: undefined,
      stoneSkillBalance: undefined,
      clayWeaponsBalance: undefined,
      woodWeaponsBalance: undefined,
      stoneWeaponsBalance: undefined,
      mercenaryBalance: undefined,
      spearmanBalance: undefined,
      mageBalance: undefined,
      archerBalance: undefined,
      paladinBalance: undefined,
    });
  }
}


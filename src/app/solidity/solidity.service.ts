import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {LandState, LandStateModel} from "../state/land/land.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import CBKLand from "../../../build/contracts/CBKLandInterface.json";
import Characters from "../../../build/contracts/CharactersInterface.json";
import CharacterStaking from "../../../build/contracts/CharacterStaking.json";
import Weapons from "../../../build/contracts/WeaponsInterface.json";
import WeaponStaking from "../../../build/contracts/WeaponStaking.json";
import {environment} from "../../environments/environment";
import Village from "../../../build/contracts/Village.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class SolidityService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);
  landContract!: Contract;
  villageContract!: Contract;
  charactersContract!: Contract;
  characterStakingContract!: Contract;
  weaponsContract!: Contract;
  weaponStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    private web3: Web3Service,
  ) {
    this.landContract = new this.web3.eth.Contract(CBKLand.abi as any, environment.landContract);
    this.villageContract = new this.web3.eth.Contract(Village.abi as any, Village.networks["5777"]!.address);
    this.charactersContract = new this.web3.eth.Contract(Characters.abi as any, environment.charactersContract);
    this.characterStakingContract = new this.web3.eth.Contract(CharacterStaking.abi as any, CharacterStaking.networks["5777"]!.address);
    this.weaponsContract = new this.web3.eth.Contract(Weapons.abi as any, environment.weaponsContract);
    this.weaponStakingContract = new this.web3.eth.Contract(WeaponStaking.abi as any, WeaponStaking.networks["5777"]!.address);
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
      console.log(state);
    });
  }
}

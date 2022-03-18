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
import KingToken from "../../../build/contracts/KingToken.json";
import KingStaking from "../../../build/contracts/KingStaking.json";
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
  kingContract!: Contract;
  kingStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.villageContract = new this.web3.eth.Contract(Village.abi as any, Village.networks["5777"]!.address);
    this.villageContract.methods.cbkLand().call().then((address: string) => {
      this.landContract = new this.web3.eth.Contract(CBKLand.abi as any, address);
    });
    console.log('landContract', this.landContract);
    this.characterStakingContract = new this.web3.eth.Contract(CharacterStaking.abi as any, CharacterStaking.networks["5777"]!.address);
    this.characterStakingContract.methods.nft().call().then((address: string) => {
      this.charactersContract = new this.web3.eth.Contract(Characters.abi as any, address);
    });
    this.weaponStakingContract = new this.web3.eth.Contract(WeaponStaking.abi as any, WeaponStaking.networks["5777"]!.address);
    this.weaponStakingContract.methods.nft().call().then((address: string) => {
      this.weaponsContract = new this.web3.eth.Contract(Weapons.abi as any, address);
    });
    this.kingStakingContract = new this.web3.eth.Contract(KingStaking.abi as any, KingStaking.networks["5777"]!.address);
    this.kingStakingContract.methods.currency().call().then((address: string) => {
      this.kingContract = new this.web3.eth.Contract(KingToken.abi as any, address);
    });
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
      console.log(state);
    });
  }
}

import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import CharacterStaking from "../../../build/contracts/CharacterStaking.json";
import Characters from "../../../build/contracts/CharactersInterface.json";
import Garrison from "../../../build/contracts/GarrisonInterface.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {environment} from 'src/environments/environment';
import {Networks} from "../interfaces/networks";

const development = require("src/assets/addresses/development");
const test = require("src/assets/addresses/test");
const production = require("src/assets/addresses/production");

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class CharactersService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  charactersContract!: Promise<Contract>;
  characterStakingContract!: Contract;
  garrisonContract!: Contract;
  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.characterStakingContract = new this.web3.eth.Contract(CharacterStaking.abi as any, (CharacterStaking.networks as Networks)[environment.networkId]?.address);
    this.charactersContract = this.characterStakingContract.methods.nft().call().then((address: string) => {
      return new this.web3.eth.Contract(Characters.abi as any, address);
    });
    if (environment.environment === "TEST") {
      this.garrisonContract = new this.web3.eth.Contract(Garrison.abi as any, test.garrisonAddress);
    } else if (environment.environment === "PRODUCTION") {
      this.garrisonContract = new this.web3.eth.Contract(Garrison.abi as any, production.garrisonAddress);
    } else {
      this.garrisonContract = new this.web3.eth.Contract(Garrison.abi as any, development.garrisonAddress);
    }
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
    });
  }

  async getOwnedCharacters(): Promise<number[]> {
    const accountCharacters = (await (await this.charactersContract).methods.getReadyCharacters(this.currentAccount).call()).map((character: string) => +character);
    const garrisonCharacters = (await this.garrisonContract.methods.getUserCharacters().call({from: this.currentAccount})).map((character: string) => +character);
    return accountCharacters.concat(garrisonCharacters);
  }

  async getOwnedAmount(): Promise<number> {
    const accountCharactersAmount = +await (await this.charactersContract).methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    const garrisonCharactersAmount = (await this.garrisonContract.methods.getUserCharacters().call({from: this.currentAccount})).length;
    return accountCharactersAmount + garrisonCharactersAmount;
  }

  async setApprovedForAll(): Promise<void> {
    await (await this.charactersContract).methods.setApprovalForAll(this.characterStakingContract.options.address, true).send({from: this.currentAccount});
  }

  async isApprovedForAll(): Promise<boolean> {
    return await (await this.charactersContract).methods.isApprovedForAll(this.currentAccount, this.characterStakingContract.options.address).call({from: this.currentAccount});
  }

  async stake(ids: number[]): Promise<void> {
    const isApprovedForAll = await this.isApprovedForAll();
    if (!isApprovedForAll) {
      for (const id of ids) {
        const idOwner = await (await this.charactersContract).methods.ownerOf(id).call({from: this.currentAccount});
        if (idOwner === this.currentAccount) {
          const approved = await (await this.charactersContract).methods.getApproved(id).call({from: this.currentAccount});
          if (approved !== this.characterStakingContract.options.address) {
            await (await this.charactersContract).methods.approve(this.characterStakingContract.options.address, id).send({from: this.currentAccount});
          }
        }
      }
    }
    await this.characterStakingContract.methods.stake(ids).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.characterStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getTotalStaked(): Promise<number> {
    return +await this.characterStakingContract.methods.getStakedAmount(this.currentAccount).call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    return +await this.characterStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
  }

  async getNextRequirement(): Promise<number> {
    return +await this.characterStakingContract.methods.getNextRequirement().call({from: this.currentAccount});
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.characterStakingContract.methods.getUnlockedTiers().call({from: this.currentAccount});
  }

  async unstake(): Promise<void> {
    await this.characterStakingContract.methods.unstake().send({from: this.currentAccount});
  }

  async getCurrentStake(): Promise<number> {
    return +await this.characterStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.characterStakingContract.methods.completeStake().send({from: this.currentAccount});
  }

  async canCompleteStake(): Promise<boolean> {
    return this.characterStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }
}

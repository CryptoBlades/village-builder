import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../../state/wallet/wallet.state";
import {Store} from "@ngxs/store";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LandState, LandStateModel} from "../../state/land/land.state";
import {Land} from "../../interfaces/land";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  ClearWalletState,
  SetArcherBalance,
  SetBruiserBalance,
  SetCharactersBalance,
  SetKingBalance,
  SetMageBalance,
  SetMercenaryBalance,
  SetMetamaskConnected,
  SetPaladinBalance,
  SetSkillBalance,
  SetSkillClayBalance,
  SetSkillStoneBalance,
  SetSkillWoodBalance,
  SetWalletAddress,
  SetWeaponsBalance,
  SetWeaponsClayBalance,
  SetWeaponsStoneBalance,
  SetWeaponsWoodBalance
} from "../../state/wallet/wallet.actions";
import {extractResourcesFromUnlockedTiers, extractUnitsFromUnlockedTiers} from "../../common/common";
import {SetLandSelected} from "../../state/land/land.actions";
import {Web3Service} from "../../services/web3.service";
import {LandService} from "../../solidity/land.service";
import {CharactersService} from "../../solidity/characters.service";
import {WeaponsService} from "../../solidity/weapons.service";
import {KingService} from "../../solidity/king.service";
import {SkillService} from "../../solidity/skill.service";
import {StakingTier} from "../../interfaces/staking-tier";
import skillStakingTiers from '../../../assets/staking-tiers/skill.json';
import weaponsStakingTiers from '../../../assets/staking-tiers/weapons.json';
import charactersStakingTiers from '../../../assets/staking-tiers/characters.json';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);

  walletAddress: string = '';
  kingBalance: number = 0;
  skillBalance: number = 0;
  weaponsBalance: number = 0;
  charactersBalance: number = 0;
  clayBalance: number = 0;
  woodBalance: number = 0;
  stoneBalance: number = 0;
  mercenaryBalance: number = 0;
  bruiserBalance: number = 0;
  mageBalance: number = 0;
  archerBalance: number = 0;
  paladinBalance: number = 0;
  land?: Land;
  isConnected = false;
  isLoading = false;

  skillStakingTiers: StakingTier[] = skillStakingTiers;
  weaponsStakingTiers: StakingTier[] = weaponsStakingTiers;
  charactersStakingTiers: StakingTier[] = charactersStakingTiers;

  constructor(
    private store: Store,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
    private weaponsService: WeaponsService,
    private kingService: KingService,
    private skillService: SkillService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.connectMetamask();
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.walletAddress = state.publicAddress;
      this.kingBalance = state.kingBalance;
      this.skillBalance = state.skillBalance;
      this.weaponsBalance = state.weaponsBalance;
      this.charactersBalance = state.charactersBalance;
      this.clayBalance = state.claySkillBalance + state.clayWeaponsBalance;
      this.woodBalance = state.woodSkillBalance + state.woodWeaponsBalance;
      this.stoneBalance = state.stoneSkillBalance + state.stoneWeaponsBalance;
      this.mercenaryBalance = state.mercenaryBalance;
      this.bruiserBalance = state.bruiserBalance;
      this.mageBalance = state.mageBalance;
      this.archerBalance = state.archerBalance;
      this.paladinBalance = state.paladinBalance;
      this.isConnected = state.isConnected;
    });
    this.land$.pipe(untilDestroyed(this)).subscribe((state: LandStateModel) => {
      this.land = state.selectedLand;
    });
  }

  get formattedWalletAddress() {
    let firstFiveChars = this.walletAddress.slice(0, 5);
    let lastFourChars = this.walletAddress.slice(this.walletAddress.length - 4);
    return firstFiveChars + "..." + lastFourChars;
  }

  async disconnectMetamask() {
    this.store.dispatch(new ClearWalletState());
  }

  async connectMetamask() {
    try {
      this.isLoading = true;
      const provider = await detectEthereumProvider() as any;
      provider?.request({method: 'eth_requestAccounts'}).then(async (accounts: any) => {
        this.store.dispatch(new SetWalletAddress(this.web3.utils.toChecksumAddress(accounts[0])));
        this.store.dispatch([
          new SetKingBalance(await this.kingService.getOwnedAmount()),
          new SetSkillBalance(await this.skillService.getOwnedAmount()),
          new SetWeaponsBalance(await this.weaponsService.getOwnedAmount()),
          new SetCharactersBalance(await this.charactersService.getOwnedAmount()),
        ]);
        const unlockedSkillTiers = await this.skillService.getUnlockedTiers();
        const unlockedWeaponsTiers = await this.weaponsService.getUnlockedTiers();
        if (unlockedSkillTiers || unlockedWeaponsTiers) {
          console.log(unlockedSkillTiers, unlockedWeaponsTiers);
          const {
            clay: skillClay,
            wood: skillWood,
            stone: skillStone
          } = extractResourcesFromUnlockedTiers(this.skillStakingTiers, unlockedSkillTiers);
          const {
            clay: weaponClay,
            wood: weaponWood,
            stone: weaponStone
          } = extractResourcesFromUnlockedTiers(this.weaponsStakingTiers, unlockedWeaponsTiers);
          this.store.dispatch([
            new SetSkillClayBalance(skillClay),
            new SetSkillWoodBalance(skillWood),
            new SetSkillStoneBalance(skillStone),
            new SetWeaponsClayBalance(weaponClay),
            new SetWeaponsWoodBalance(weaponWood),
            new SetWeaponsStoneBalance(weaponStone),
          ]);
        }
        const unlockedCharactersTiers = await this.charactersService.getUnlockedTiers();
        if (unlockedCharactersTiers) {
          const {
            mercenary,
            bruiser,
            mage,
            archer,
            paladin
          } = extractUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
          this.store.dispatch([
            new SetMercenaryBalance(mercenary),
            new SetBruiserBalance(bruiser),
            new SetMageBalance(mage),
            new SetArcherBalance(archer),
            new SetPaladinBalance(paladin),
          ]);
        }
        this.store.dispatch(new SetMetamaskConnected(true));
        const stakedLand = await this.landService.getStakedLand();
        console.log(stakedLand);
        if (stakedLand) {
          this.store.dispatch(new SetLandSelected(stakedLand));
        }
      });
    } catch (err) {
      console.error('Connect metamask fail:', err);
    } finally {
      this.isLoading = false;
    }
  }
}

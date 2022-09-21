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
  SetArcherBalance, SetArcherUnlocksBalance,
  SetBruiserBalance, SetBruiserUnlocksBalance,
  SetCharactersBalance,
  SetKingBalance,
  SetLands,
  SetMageBalance, SetMageUnlocksBalance,
  SetMercenaryBalance, SetMercenaryUnlocksBalance,
  SetMetamaskConnected,
  SetPaladinBalance, SetPaladinUnlocksBalance,
  SetSkillBalance,
  SetSkillClayBalance, SetSkillClayUnlocksBalance,
  SetSkillStoneBalance, SetSkillStoneUnlocksBalance,
  SetSkillWoodBalance, SetSkillWoodUnlocksBalance,
  SetWalletAddress,
  SetWeaponsBalance,
  SetWeaponsClayBalance, SetWeaponsClayUnlocksBalance,
  SetWeaponsStoneBalance, SetWeaponsStoneUnlocksBalance,
  SetWeaponsWoodBalance, SetWeaponsWoodUnlocksBalance
} from "../../state/wallet/wallet.actions";
import {
  extractRewardResourcesFromUnlockedTiers,
  extractRewardUnitsFromUnlockedTiers,
  extractUnlocksResourcesFromUnlockedTiers, extractUnlocksUnitsFromUnlockedTiers
} from "../../common/common";
import {SetBuildings, SetLandSelected} from "../../state/land/land.actions";
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
  kingBalance?: number;
  skillBalance?: number;
  weaponsBalance?: number;
  charactersBalance?: number;
  clayBalance?: number;
  clayUnlocksBalance?: number;
  woodBalance?: number;
  woodUnlocksBalance?: number;
  stoneBalance?: number;
  stoneUnlocksBalance?: number;
  mercenaryBalance?: number;
  mercenaryUnlocksBalance?: number;
  bruiserBalance?: number;
  bruiserUnlocksBalance?: number;
  mageBalance?: number;
  mageUnlocksBalance?: number;
  archerBalance?: number;
  archerUnlocksBalance?: number;
  paladinBalance?: number;
  paladinUnlocksBalance?: number;
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
      if (state.claySkillBalance !== undefined && state.clayWeaponsBalance !== undefined) {
        this.clayBalance = state.claySkillBalance + state.clayWeaponsBalance;
      }
      if (state.claySkillUnlocksBalance !== undefined && state.clayWeaponsUnlocksBalance !== undefined) {
        this.clayUnlocksBalance = state.claySkillUnlocksBalance + state.clayWeaponsUnlocksBalance;
      }
      if (state.woodSkillBalance !== undefined && state.woodWeaponsBalance !== undefined) {
        this.woodBalance = state.woodSkillBalance + state.woodWeaponsBalance;
      }
      if (state.woodSkillUnlocksBalance !== undefined && state.woodWeaponsUnlocksBalance !== undefined) {
        this.woodUnlocksBalance = state.woodSkillUnlocksBalance + state.woodWeaponsUnlocksBalance;
      }
      if (state.stoneSkillBalance !== undefined && state.stoneWeaponsBalance !== undefined) {
        this.stoneBalance = state.stoneSkillBalance + state.stoneWeaponsBalance;
      }
      if (state.stoneSkillUnlocksBalance !== undefined && state.stoneWeaponsUnlocksBalance !== undefined) {
        this.stoneUnlocksBalance = state.stoneSkillUnlocksBalance + state.stoneWeaponsUnlocksBalance;
      }
      this.mercenaryBalance = state.mercenaryBalance;
      this.mercenaryUnlocksBalance = state.mercenaryUnlocksBalance;
      this.bruiserBalance = state.bruiserBalance;
      this.bruiserUnlocksBalance = state.bruiserUnlocksBalance;
      this.mageBalance = state.mageBalance;
      this.mageUnlocksBalance = state.mageUnlocksBalance;
      this.archerBalance = state.archerBalance;
      this.archerUnlocksBalance = state.archerUnlocksBalance;
      this.paladinBalance = state.paladinBalance;
      this.paladinUnlocksBalance = state.paladinUnlocksBalance;
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
      provider?.request({method: 'eth_requestAccounts'}).then(async (accounts: string[]) => {
        await this.setWalletBalances(accounts);
      });
      (window.ethereum as any).on('accountsChanged', async (accounts: string[]) => {
        this.store.dispatch(new ClearWalletState());
        await this.setWalletBalances(accounts);
      });
    } catch (err) {
      console.error('Connect metamask fail:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async setWalletBalances(accounts: string[]) {
    this.store.dispatch(new SetWalletAddress(this.web3.utils.toChecksumAddress(accounts[0])));
    this.store.dispatch([
      new SetKingBalance(await this.kingService.getOwnedAmount()),
      new SetSkillBalance(await this.skillService.getOwnedAmount()),
      new SetWeaponsBalance(await this.weaponsService.getOwnedAmount()),
      new SetCharactersBalance(await this.charactersService.getOwnedAmount()),
    ]);
    const unlockedSkillTiers = await this.skillService.getUnlockedTiers();
    const unlockedWeaponsTiers = await this.weaponsService.getUnlockedTiers();
    if (unlockedSkillTiers !== undefined || unlockedWeaponsTiers !== undefined) {
      console.log(unlockedSkillTiers, unlockedWeaponsTiers);
      const {
        clay: skillClay,
        wood: skillWood,
        stone: skillStone
      } = extractRewardResourcesFromUnlockedTiers(this.skillStakingTiers, unlockedSkillTiers);
      const {
        clay: skillClayUnlocks,
        wood: skillWoodUnlocks,
        stone: skillStoneUnlocks
      } = extractUnlocksResourcesFromUnlockedTiers(this.skillStakingTiers, unlockedSkillTiers);
      const {
        clay: weaponClay,
        wood: weaponWood,
        stone: weaponStone
      } = extractRewardResourcesFromUnlockedTiers(this.weaponsStakingTiers, unlockedWeaponsTiers);
      const {
        clay: weaponClayUnlocks,
        wood: weaponWoodUnlocks,
        stone: weaponStoneUnlocks
      } = extractUnlocksResourcesFromUnlockedTiers(this.weaponsStakingTiers, unlockedWeaponsTiers);
      this.store.dispatch([
        new SetSkillClayBalance(skillClay),
        new SetSkillWoodBalance(skillWood),
        new SetSkillStoneBalance(skillStone),
        new SetSkillClayUnlocksBalance(skillClayUnlocks),
        new SetSkillWoodUnlocksBalance(skillWoodUnlocks),
        new SetSkillStoneUnlocksBalance(skillStoneUnlocks),
        new SetWeaponsClayBalance(weaponClay),
        new SetWeaponsWoodBalance(weaponWood),
        new SetWeaponsStoneBalance(weaponStone),
        new SetWeaponsClayUnlocksBalance(weaponClayUnlocks),
        new SetWeaponsWoodUnlocksBalance(weaponWoodUnlocks),
        new SetWeaponsStoneUnlocksBalance(weaponStoneUnlocks),
      ]);
    }
    const unlockedCharactersTiers = await this.charactersService.getUnlockedTiers();
    if (unlockedCharactersTiers !== undefined) {
      const {
        mercenary,
        bruiser,
        mage,
        archer,
        paladin
      } = extractRewardUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
      const {
        mercenary: mercenaryUnlocks,
        bruiser: bruiserUnlocks,
        mage: mageUnlocks,
        archer: archerUnlocks,
        paladin: paladinUnlocks
      } = extractUnlocksUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
      this.store.dispatch([
        new SetMercenaryBalance(mercenary),
        new SetBruiserBalance(bruiser),
        new SetMageBalance(mage),
        new SetArcherBalance(archer),
        new SetPaladinBalance(paladin),
        new SetMercenaryUnlocksBalance(mercenaryUnlocks),
        new SetBruiserUnlocksBalance(bruiserUnlocks),
        new SetMageUnlocksBalance(mageUnlocks),
        new SetArcherUnlocksBalance(archerUnlocks),
        new SetPaladinUnlocksBalance(paladinUnlocks),
      ]);
    }
    this.store.dispatch(new SetLands(await this.landService.getOwnedLands()));
    this.store.dispatch(new SetMetamaskConnected(true));
    const stakedLand = await this.landService.getStakedLand();
    this.store.dispatch(new SetLandSelected(stakedLand));
    this.store.dispatch(new SetBuildings(await this.landService.getBuildings()));
  }
}

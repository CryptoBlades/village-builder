import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {NgxsModule} from "@ngxs/store";
import {WalletState} from "./state/wallet/wallet.state";
import {WEB3_CONFIG, Web3Service} from "./services/web3.service";
import Web3 from "web3";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {SelectLandComponent} from './components/select-land/select-land.component';
import {LandState} from "./state/land/land.state";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BuildingDialogComponent} from './components/building-dialog/building-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CharacterStakingComponent} from './components/character-staking/character-staking.component';
import {MatIconModule} from "@angular/material/icon";
import {KingStakingComponent} from './components/king-staking/king-staking.component';
import {MatStepperModule} from "@angular/material/stepper";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {StakingTiersStepperComponent} from './components/staking-tiers-stepper/staking-tiers-stepper.component';
import {ResourcePillComponent} from './components/resource-pill/resource-pill.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {SkillStakingComponent} from './components/skill-staking/skill-staking.component';
import {WeaponStakingComponent} from './components/weapon-staking/weapon-staking.component';
import {MatChipsModule} from "@angular/material/chips";
import { KingVaultDialogComponent } from './components/king-vault-dialog/king-vault-dialog.component';
import { NextTierUnlocksComponent } from './components/next-tier-unlocks/next-tier-unlocks.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SelectLandComponent,
    BuildingDialogComponent,
    CharacterStakingComponent,
    KingStakingComponent,
    StakingTiersStepperComponent,
    ResourcePillComponent,
    SkillStakingComponent,
    WeaponStakingComponent,
    KingVaultDialogComponent,
    NextTierUnlocksComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    NgxsModule.forRoot([WalletState, LandState], {
      developmentMode: !environment.production
    }),
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatStepperModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatChipsModule,
  ],
  providers: [
    Web3Service,
    {
      provide: WEB3_CONFIG,
      useValue: Web3.givenProvider || 'ws://localhost:7545'
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

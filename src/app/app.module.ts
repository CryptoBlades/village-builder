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
import {KingVaultDialogComponent} from './components/king-vault-dialog/king-vault-dialog.component';
import {NextTierUnlocksComponent} from './components/next-tier-unlocks/next-tier-unlocks.component';
import {TimestampCountdownDirective} from './directives/timestamp-countdown.directive';
import {
  SimpleConfirmationDialogComponent
} from './components/simple-confirmation-dialog/simple-confirmation-dialog.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ClickableBuildingComponent} from './components/clickable-building/clickable-building.component';
import {MatCardModule} from "@angular/material/card";
import {DragScrollModule} from "ngx-drag-scroll";
import {MatSidenavModule} from "@angular/material/sidenav";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";
import * as enUS from '../assets/i18n/en-US.json';
import {UserOptionState} from "./state/user-option/user-option.state";

const languages: any = {
  'en-US': (enUS as any).default || enUS,
};

export class JSONLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(languages[lang] || enUS);
  }
}

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
    NextTierUnlocksComponent,
    TimestampCountdownDirective,
    SimpleConfirmationDialogComponent,
    ClickableBuildingComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    NgxsModule.forRoot([WalletState, LandState, UserOptionState], {
      developmentMode: !environment.production
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: JSONLoader,
      },
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
    MatProgressSpinnerModule,
    MatCardModule,
    DragScrollModule,
    MatSidenavModule,
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

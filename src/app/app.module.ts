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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    NgxsModule.forRoot([WalletState], {
      developmentMode: !environment.production
    }),
    MatButtonModule,
  ],
  providers: [
    Web3Service,
    {
      provide: WEB3_CONFIG,
      useValue: Web3.givenProvider || 'ws://localhost:7545'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {Inject, Injectable, InjectionToken} from '@angular/core';
import Web3 from 'web3';
import {provider} from 'web3-core';

export const WEB3_CONFIG = new InjectionToken<provider>('Webb3Config');

@Injectable()
export class Web3Service extends Web3 {
  constructor(@Inject(WEB3_CONFIG) provider: provider) {
    super(provider);
  }
}

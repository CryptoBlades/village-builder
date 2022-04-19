export class SetWalletAddress {
  static readonly type = '[Wallet] Set Walletaddress';
  constructor(public payload: string) {}
}

export class SetKingBalance {
  static readonly type = '[Wallet] Set King Balance';
  constructor(public payload: number) {}
}

export class SetMetamaskInstalled {
  static readonly type = '[Wallet] Set MetaMask Installed';
  constructor(public payload: boolean) {}
}

export class SetMetamaskConnected {
  static readonly type = '[Wallet] Set MetaMask Connectted';
  constructor(public payload: boolean) {}
}

export class ClearWalletState {
  static readonly type = '[Wallet] Clear State';
  constructor() {}
}

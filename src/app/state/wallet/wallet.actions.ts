export class SetWalletAddress {
  static readonly type = '[Wallet] Set Walletaddress';

  constructor(public payload: string) {
  }
}

export class SetKingBalance {
  static readonly type = '[Wallet] Set King Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillBalance {
  static readonly type = '[Wallet] Set Skill Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsBalance {
  static readonly type = '[Wallet] Set Weapons Balance';

  constructor(public payload: number) {
  }
}

export class SetCharactersBalance {
  static readonly type = '[Wallet] Set Characters Balance';

  constructor(public payload: number) {
  }
}

export class SetClayBalance {
  static readonly type = '[Wallet] Set Clay Balance';

  constructor(public payload: number) {
  }
}

export class SetWoodBalance {
  static readonly type = '[Wallet] Set Wood Balance';

  constructor(public payload: number) {
  }
}

export class SetStoneBalance {
  static readonly type = '[Wallet] Set Stone Balance';

  constructor(public payload: number) {
  }
}

export class SetMetamaskInstalled {
  static readonly type = '[Wallet] Set MetaMask Installed';

  constructor(public payload: boolean) {
  }
}

export class SetMetamaskConnected {
  static readonly type = '[Wallet] Set MetaMask Connectted';

  constructor(public payload: boolean) {
  }
}

export class ClearWalletState {
  static readonly type = '[Wallet] Clear State';

  constructor() {
  }
}

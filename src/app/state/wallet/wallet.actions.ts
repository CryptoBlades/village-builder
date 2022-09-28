import {Land} from "../../interfaces/land";

export class SetWalletAddress {
  static readonly type = '[Wallet] Set Walletaddress';

  constructor(public payload: string) {
  }
}

export class SetLands {
  static readonly type = '[Wallet] Set Lands';

  constructor(public payload: Land[]) {
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

export class SetSkillClayBalance {
  static readonly type = '[Wallet] Set Skill Clay Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillClayUnlocksBalance {
  static readonly type = '[Wallet] Set Skill Clay Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsClayBalance {
  static readonly type = '[Wallet] Set Weapons Clay Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsClayUnlocksBalance {
  static readonly type = '[Wallet] Set Weapons Clay Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillWoodBalance {
  static readonly type = '[Wallet] Set Skill Wood Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillWoodUnlocksBalance {
  static readonly type = '[Wallet] Set Skill Wood Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsWoodBalance {
  static readonly type = '[Wallet] Set Weapons Wood Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsWoodUnlocksBalance {
  static readonly type = '[Wallet] Set Weapons Wood Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillStoneBalance {
  static readonly type = '[Wallet] Set Skill Stone Balance';

  constructor(public payload: number) {
  }
}

export class SetSkillStoneUnlocksBalance {
  static readonly type = '[Wallet] Set Skill Stone Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsStoneBalance {
  static readonly type = '[Wallet] Set Weapons Stone Balance';

  constructor(public payload: number) {
  }
}

export class SetWeaponsStoneUnlocksBalance {
  static readonly type = '[Wallet] Set Weapons Stone Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetMercenaryBalance {
  static readonly type = '[Wallet] Set Mercenary Balance';

  constructor(public payload: number) {
  }
}

export class SetSpearmanBalance {
  static readonly type = '[Wallet] Set Spearman Balance';

  constructor(public payload: number) {
  }
}

export class SetMageBalance {
  static readonly type = '[Wallet] Set Mage Balance';

  constructor(public payload: number) {
  }
}

export class SetArcherBalance {
  static readonly type = '[Wallet] Set Archer Balance';

  constructor(public payload: number) {
  }
}

export class SetPaladinBalance {
  static readonly type = '[Wallet] Set Paladin Balance';

  constructor(public payload: number) {
  }
}

export class SetMercenaryUnlocksBalance {
  static readonly type = '[Wallet] Set Mercenary Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetSpearmanUnlocksBalance {
  static readonly type = '[Wallet] Set Spearman Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetMageUnlocksBalance {
  static readonly type = '[Wallet] Set Mage Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetArcherUnlocksBalance {
  static readonly type = '[Wallet] Set Archer Unlocks Balance';

  constructor(public payload: number) {
  }
}

export class SetPaladinUnlocksBalance {
  static readonly type = '[Wallet] Set Paladin Unlocks Balance';

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

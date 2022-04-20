export interface StakingTier {
  duration: number;
  amount: number;
  type: string;
  requirement?: {
    type: string;
    amount: number;
  };
  rewards: {
    type: string;
    amount: number;
  }[];
  unlocks: {
    type: string;
    amount: number;
  }[];
}

import {BuildingType} from "../enums/building-type";
import {StakingTier} from "../interfaces/staking-tier";


export const getBuildingTypeName = (buildingType: BuildingType): string => {
  return BuildingType[buildingType];
};

export const _filter = (value: number, options: number[]): string[] => {
  if (!value) {
    return options.map(option => option.toString());
  }
  return options.map(option => option.toString()).filter(option => option.toLowerCase().includes(value.toString().toLowerCase()));
}

export const extractRewardResourcesFromUnlockedTiers = (stakingTiers: StakingTier[], unlockedTiers: number) => {
  const resources = Array.from(stakingTiers.slice(0, unlockedTiers)
    .flatMap(tier => tier.rewards).filter(reward => reward.type !== 'KING').reduce(
      (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
    ), ([type, amount]) => ({type, amount}));
  const clay = resources.find(resource => resource.type === 'Clay')?.amount || 0;
  const wood = resources.find(resource => resource.type === 'Wood')?.amount || 0;
  const stone = resources.find(resource => resource.type === 'Stone')?.amount || 0;
  return {clay, wood, stone};
}

export const extractUnlocksResourcesFromUnlockedTiers = (stakingTiers: StakingTier[], unlockedTiers: number) => {
  const resources = Array.from(stakingTiers.slice(0, unlockedTiers)
    .flatMap(tier => tier.unlocks).reduce(
      (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
    ), ([type, amount]) => ({type, amount}));
  const clay = resources.find(resource => resource.type === 'Clay')?.amount || 0;
  const wood = resources.find(resource => resource.type === 'Wood')?.amount || 0;
  const stone = resources.find(resource => resource.type === 'Stone')?.amount || 0;
  return {clay, wood, stone};
}

export const extractRewardUnitsFromUnlockedTiers = (stakingTiers: StakingTier[], unlockedTiers: number) => {
  const units = Array.from(stakingTiers.slice(0, unlockedTiers)
    .flatMap(tier => tier.rewards).reduce(
      (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
    ), ([type, amount]) => ({type, amount}));
  const mercenary = units.find(unit => unit.type === 'Mercenary')?.amount || 0;
  const bruiser = units.find(unit => unit.type === 'Bruiser')?.amount || 0;
  const mage = units.find(unit => unit.type === 'Mage')?.amount || 0;
  const archer = units.find(unit => unit.type === 'Archer')?.amount || 0;
  const paladin = units.find(unit => unit.type === 'Paladin')?.amount || 0;
  return {mercenary, bruiser, mage, archer, paladin};
}

export const extractUnlocksUnitsFromUnlockedTiers = (stakingTiers: StakingTier[], unlockedTiers: number) => {
  const units = Array.from(stakingTiers.slice(0, unlockedTiers)
    .flatMap(tier => tier.unlocks).reduce(
      (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
    ), ([type, amount]) => ({type, amount}));
  const mercenary = units.find(unit => unit.type === 'Mercenary')?.amount || 0;
  const bruiser = units.find(unit => unit.type === 'Bruiser')?.amount || 0;
  const mage = units.find(unit => unit.type === 'Mage')?.amount || 0;
  const archer = units.find(unit => unit.type === 'Archer')?.amount || 0;
  const paladin = units.find(unit => unit.type === 'Paladin')?.amount || 0;
  return {mercenary, bruiser, mage, archer, paladin};
}

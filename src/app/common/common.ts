import {BuildingType} from "../solidity/king.service";

export const getBuildingTypeName = (buildingType: BuildingType): string => {
  return BuildingType[buildingType];
};

export const getTimeRemaining = (end: string) => {
  const total = new Date(+end * 1000).getTime() - new Date().getTime();
  let seconds: string | number = Math.floor((total / 1000) % 60);
  let minutes: string | number = Math.floor((total / 1000 / 60) % 60);
  let hours: string | number = Math.floor((total / (1000 * 60 * 60)) % 24);
  let days: string | number = Math.floor((total / (1000 * 60 * 60 * 24)));
  if (seconds < 10) {
    seconds = String(seconds).padStart(2, '0');
  }
  if (minutes < 10) {
    minutes = String(minutes).padStart(2, '0');
  }
  if (hours < 10) {
    hours = String(hours).padStart(2, '0');
  }
  if (days < 10) {
    days = String(days).padStart(2, '0');
  }

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
};

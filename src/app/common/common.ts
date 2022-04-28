import {BuildingType} from "../enums/building-type";


export const getBuildingTypeName = (buildingType: BuildingType): string => {
  return BuildingType[buildingType];
};

export const _filter = (value: number, options: number[]): string[] => {
  if (!value) {
    return options.map(option => option.toString());
  }
  return options.map(option => option.toString()).filter(option => option.toLowerCase().includes(value.toString().toLowerCase()));
}

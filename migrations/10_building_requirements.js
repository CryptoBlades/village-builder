const Village = artifacts.require('Village');
const TOWN_HALL = 1;
const HEADQUARTERS = 2;
const BARRACKS = 3;
const CLAY_PIT = 4;
const FOREST_CAMP = 5;
const STONE_MINE = 6;
const STOREHOUSE = 7;
const SMITHY = 8;
const FARM = 9;
const HIDDEN_STASH = 10;
const WALL = 11;
const MARKET = 12;

module.exports = async (deployer) => {
  const village = await Village.deployed();

  await Promise.all([
    village.setBuildingMaxLevel(TOWN_HALL, 5),
    village.setBuildingMaxLevel(HEADQUARTERS, 1),
    village.setBuildingMaxLevel(BARRACKS, 5),
    village.setBuildingMaxLevel(CLAY_PIT, 6),
    village.setBuildingMaxLevel(FOREST_CAMP, 6),
    village.setBuildingMaxLevel(STONE_MINE, 6),
    village.setBuildingMaxLevel(STOREHOUSE, 10),
    village.setBuildingMaxLevel(SMITHY, 6),
    village.setBuildingMaxLevel(FARM, 10),
    village.setBuildingMaxLevel(HIDDEN_STASH, 1),
    village.setBuildingMaxLevel(WALL, 1),
    village.setBuildingMaxLevel(MARKET, 1),

    village.setBuildingRequirement(HEADQUARTERS, TOWN_HALL, 3),
    village.setBuildingRequirement(BARRACKS, TOWN_HALL, 2),
    village.setBuildingRequirement(SMITHY, BARRACKS, 3),
    village.setBuildingRequirement(WALL, BARRACKS, 1),
    village.setBuildingRequirement(MARKET, TOWN_HALL, 5),
  ]);
};

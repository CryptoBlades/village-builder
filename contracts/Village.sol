// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./interfaces/CBKLandInterface.sol";

contract Village is Initializable, AccessControlUpgradeable, IERC721ReceiverUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

  CBKLandInterface public cbkLand;

  mapping(address => uint256) public stakedLand;
  mapping(address => uint256) public stakedFrom;
  mapping(uint256 => mapping(Building => uint256)) public buildings; // land to building to level
  mapping(uint256 => BuildingUpgrade) public currentlyUpgrading;
  mapping(Building => uint256) public buildingMaxLevel;
  mapping(Building => BuildingRequirement) public buildingRequirement;

  enum Building{NONE, TOWN_HALL, HEADQUARTERS, BARRACKS, CLAY_PIT, FOREST_CAMP, STONE_MINE, STOREHOUSE, SMITHY, FARM, HIDDEN_STASH, WALL, MARKET}

  struct BuildingUpgrade {
    Building building;
    uint256 finishTimestamp;
  }

  struct BuildingRequirement {
    Building building;
    uint256 level;
  }

  event Staked(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 indexed id);
  event BuildingUpgraded(uint256 indexed id, Building indexed building, uint256 level);

  function initialize(address cbkLandAddress) public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(GAME_ADMIN, msg.sender);

    cbkLand = CBKLandInterface(cbkLandAddress);

    buildingMaxLevel[Building.TOWN_HALL] = 5;
    buildingMaxLevel[Building.HEADQUARTERS] = 1;
    buildingMaxLevel[Building.BARRACKS] = 5;
    buildingMaxLevel[Building.CLAY_PIT] = 6;
    buildingMaxLevel[Building.FOREST_CAMP] = 6;
    buildingMaxLevel[Building.STONE_MINE] = 6;
    buildingMaxLevel[Building.STOREHOUSE] = 10;
    buildingMaxLevel[Building.SMITHY] = 6;
    buildingMaxLevel[Building.FARM] = 10;
    buildingMaxLevel[Building.HIDDEN_STASH] = 1;
    buildingMaxLevel[Building.WALL] = 1;
    buildingMaxLevel[Building.MARKET] = 1;

    buildingRequirement[Building.HEADQUARTERS] = BuildingRequirement(Building.TOWN_HALL, 3);
    buildingRequirement[Building.BARRACKS] = BuildingRequirement(Building.TOWN_HALL, 2);
    buildingRequirement[Building.SMITHY] = BuildingRequirement(Building.BARRACKS, 3);
    buildingRequirement[Building.WALL] = BuildingRequirement(Building.BARRACKS, 1);
    buildingRequirement[Building.MARKET] = BuildingRequirement(Building.TOWN_HALL, 5);
  }

  modifier assertOwnsLand(address user, uint id) {
    _assertOwnsLand(user, id);
    _;
  }

  function _assertOwnsLand(address user, uint id) internal view {
    require(cbkLand.ownerOf(id) == user, 'Not land owner');
  }

  modifier assertStakesLand(address user, uint id) {
    _assertStakesLand(user, id);
    _;
  }

  function _assertStakesLand(address user, uint id) internal view {
    require(stakedLand[user] == id, 'You do not stake this land');
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return IERC721ReceiverUpgradeable.onERC721Received.selector;
  }

  function stake(uint id) public assertOwnsLand(msg.sender, id) {
    require(stakedLand[msg.sender] == 0, 'You already have a land staked');
    stakedLand[msg.sender] = id;
    stakedFrom[msg.sender] = block.timestamp;
    cbkLand.safeTransferFrom(msg.sender, address(this), id);
    emit Staked(msg.sender, id);
  }

  function unstake(uint id) public assertStakesLand(msg.sender, id) {
    stakedLand[msg.sender] = 0;
    stakedFrom[msg.sender] = 0;
    cbkLand.safeTransferFrom(address(this), msg.sender, id);
    emit Unstaked(msg.sender, id);
  }

  function setCurrentlyUpgrading(uint id, Building building, uint finishTimestamp) public assertStakesLand(tx.origin, id) {
    BuildingUpgrade memory buildingUpgrade = currentlyUpgrading[id];
    if (buildingUpgrade.building != Building.NONE) {
      finishBuildingUpgrade(id);
    }
    require(getBuildingLevel(id, building) < buildingMaxLevel[building], 'Building is already at max level');
    BuildingRequirement memory requirement = buildingRequirement[building];
    require(getBuildingLevel(id, requirement.building) >= requirement.level, 'Required building is not at required level');
    currentlyUpgrading[id] = BuildingUpgrade(building, finishTimestamp);
  }

  function getBuildingLevel(uint id, Building building) public view returns (uint256) {
    BuildingUpgrade memory buildingUpgrade = currentlyUpgrading[id];
    if (buildingUpgrade.building == building && buildingUpgrade.finishTimestamp < block.timestamp) {
      return buildings[id][Building(building)] + 1;
    }
    return buildings[id][Building(building)];
  }

  function finishBuildingUpgrade(uint id) public {
    BuildingUpgrade memory buildingUpgrade = currentlyUpgrading[id];
    require(buildingUpgrade.building != Building.NONE, 'No upgrade in progress');
    require(buildingUpgrade.finishTimestamp < block.timestamp, 'Upgrade not yet finished');
    buildings[id][buildingUpgrade.building] += 1;
    emit BuildingUpgraded(id, buildingUpgrade.building, buildings[id][buildingUpgrade.building]);
    currentlyUpgrading[id] = BuildingUpgrade(Building.NONE, 0);
  }

  // TODO: Later move the checks to frontend
  function hasStakedLand(address user) public view returns (bool) {
    return stakedLand[user] != 0;
  }

  function getStakedLand(address user) public view returns (uint256 id) {
    return stakedLand[user];
  }

  function canUpgradeBuilding(uint id, Building building) public view returns (bool) {
    BuildingRequirement memory requirement = buildingRequirement[building];
    return getBuildingLevel(id, building) < buildingMaxLevel[building] && getBuildingLevel(id, requirement.building) >= requirement.level;
  }

  //TODO: Delete later
  function resetVillage(uint id) public {
    buildings[id][Building.TOWN_HALL] = 0;
    buildings[id][Building.HEADQUARTERS] = 0;
    buildings[id][Building.BARRACKS] = 0;
    buildings[id][Building.CLAY_PIT] = 0;
    buildings[id][Building.FOREST_CAMP] = 0;
    buildings[id][Building.STONE_MINE] = 0;
    buildings[id][Building.STOREHOUSE] = 0;
    buildings[id][Building.SMITHY] = 0;
    buildings[id][Building.FARM] = 0;
    buildings[id][Building.HIDDEN_STASH] = 0;
    buildings[id][Building.WALL] = 0;
    buildings[id][Building.MARKET] = 0;
    currentlyUpgrading[id] = BuildingUpgrade(Building.NONE, 0);
  }

}

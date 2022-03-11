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
  mapping(uint256 => mapping(Building => uint256)) public buildings; // CBKLand to building level

  //  enum Building{NONE, TOWN_HALL, HEADQUARTERS, BARRACKS, STONE_MINE, CLAY_PIT, FOREST_CAMP, CHURCH, STOREHOUSE, SMITHY, RALLY_POINT, FARM, HIDDEN_STASH, WALL, TRADING_POST}
  enum Building{NONE, TOWN_HALL, HEADQUARTERS, BARRACKS, CLAY_PIT, IRON_MINE,STONE_MINE, STOREHOUSE, SMITHY, FARM, HIDDEN_STASH, WALL, TRADING_POST}

  event Staked(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 indexed id);
  event BuildingUpgraded(uint256 indexed id, Building indexed building, uint256 level);

  function initialize(address cbkLandAddress) public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(GAME_ADMIN, msg.sender);
    cbkLand = CBKLandInterface(cbkLandAddress);
  }

  modifier assertOwnsLand(address user, uint256 id) {
    _assertOwnsLand(user, id);
    _;
  }

  function _assertOwnsLand(address user, uint256 id) internal view {
    require(cbkLand.ownerOf(id) == user, 'Not land owner');
  }

  modifier assertStakesLand(address user, uint256 id) {
    _assertStakesLand(user, id);
    _;
  }

  function _assertStakesLand(address user, uint256 id) internal view {
    require(stakedLand[user] == id, 'You do not have this land staked');
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

  // TODO: Should be external
  function upgradeBuilding(uint id, Building building) public assertStakesLand(msg.sender, id) {
    buildings[id][building] += 1;
    emit BuildingUpgraded(id, building, buildings[id][building]);
  }

  function getBuildingLevel(uint id, uint8 building) public view returns (uint256) {
    return buildings[id][Building(building)];
  }

  // TODO: Later move the checks to frontend
  function hasStakedLand(address user) public view returns (bool) {
    return stakedLand[user] != 0;
  }

  function getStakedLand(address user) public view returns (uint256 id) {
    return stakedLand[user];
  }

}

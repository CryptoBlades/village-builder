pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./interfaces/CBKLandInterface.sol";

contract LandStaking is Initializable, AccessControlUpgradeable, IERC721ReceiverUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

//  struct Stake {
//    uint256 id;
//    address owner;
//    uint256 since;
//  }

  CBKLandInterface public cbkLand;

  mapping(address => uint256) public stakedLands;
  mapping(address => uint256) public stakedFrom;

  event Staked(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 indexed id);

  function initialize() public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(GAME_ADMIN, msg.sender);
  }

  function assignCBKLandAddress(address cbkLandAddress) external {
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
    require(stakedLands[user] == id, 'You do not have this land staked');
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return IERC721ReceiverUpgradeable.onERC721Received.selector;
  }

  function stake(uint id) public assertOwnsLand(msg.sender, id) {
    require(stakedLands[msg.sender] == 0, 'You already have a land staked');
    stakedLands[msg.sender] = id;
    stakedFrom[msg.sender] = block.timestamp;
    cbkLand.safeTransferFrom(msg.sender, address(this), id);
    emit Staked(msg.sender, id);
  }

  function unstake(uint id) public assertStakesLand(msg.sender, id) {
    stakedLands[msg.sender] = 0;
    stakedFrom[msg.sender] = 0;
    cbkLand.safeTransferFrom(address(this), msg.sender, id);
    emit Unstaked(msg.sender, id);
  }

  // TODO: Later move the checks to frontend
  function hasStakedLand(address user) public view returns (bool) {
    return stakedLands[user] != 0;
  }

  function getStakedLand(address user) public view returns (uint256 id) {
    return stakedLands[user];
  }

}

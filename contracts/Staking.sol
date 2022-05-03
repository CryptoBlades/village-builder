// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./Village.sol";

contract Staking is Initializable, AccessControlUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

  Village public village;

  struct Stake {
    uint256 duration;
    uint256 amount;
    uint256 requirement;
  }

  mapping(uint256 => Stake) public stakes;
  mapping(address => uint256) public currentStake;
  mapping(address => uint256) public currentStakeStart;
  mapping(address => bool) public currentStakeRewardClaimed;
  mapping(address => uint256) public unlockedTiers;

  event FirstStake(address indexed user);
  event StakeComplete(address indexed user, uint256 indexed id);

  function initialize(Village _village) virtual public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, tx.origin);
    _setupRole(GAME_ADMIN, tx.origin);

    village = _village;
  }

  function firstStake() public {
    require(getUnlockedTiers() == 0, 'You have already staked');
    currentStake[tx.origin] = 1;
    emit FirstStake(tx.origin);
  }

  function completeStake() public virtual {
    uint256 currentStakeId = currentStake[tx.origin];
    require(block.timestamp > currentStakeStart[tx.origin] + stakes[currentStakeId].duration, 'Stake not completed');
    require(!currentStakeRewardClaimed[tx.origin], 'Reward already claimed');
    unlockedTiers[tx.origin] += 1;
    currentStakeRewardClaimed[tx.origin] = true;
    emit StakeComplete(tx.origin, currentStake[tx.origin]);
  }

  function assignNextStake(uint currentStakeId) public {
    if (stakes[currentStakeId + 1].duration == 0) {
      currentStake[tx.origin] = 0;
    } else {
      currentStake[tx.origin] += 1;
    }
    currentStakeRewardClaimed[tx.origin] = false;
  }

  function getStakeCompleteTimestamp() public view returns (uint256) {
    return currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration;
  }

  function addStake(uint id, uint duration, uint requirement, uint amount) public {
    stakes[id] = Stake({duration : duration, requirement : requirement, amount : amount});
  }

  function getUnlockedTiers() public view returns (uint256) {
    if (currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration < block.timestamp && currentStake[tx.origin] != 0 && !currentStakeRewardClaimed[tx.origin]) {
      return unlockedTiers[tx.origin] + 1;
    }
    return unlockedTiers[tx.origin];
  }

  function canCompleteStake() public view returns (bool) {
    return currentStake[tx.origin] != 0 && !currentStakeRewardClaimed[tx.origin] && (block.timestamp > currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration);
  }
}

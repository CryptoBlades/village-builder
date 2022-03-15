// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Village.sol";

contract CurrencyStaking is Initializable, AccessControlUpgradeable {
  using SafeMath for uint256;

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

  Village public village;
  IERC20Upgradeable public currency;

  struct Stake {
    uint256 duration;
    uint256 amount;
    uint256 requirement;
  }

  mapping(address => uint256) public stakedCurrencies;
  mapping(uint256 => Stake) public stakes;
  mapping(address => uint256) public currentStake;
  mapping(address => uint256) public currentStakeStart;
  mapping(address => bool) public currentStakeRewardClaimed;
  mapping(address => uint256) public unlockedTiers;

  event FirstStake(address indexed user);
  event Staked(address indexed user, uint256 amount);
  event StakeComplete(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 amount);

  function initialize(Village _village, address currencyAddress) virtual public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, tx.origin);
    _setupRole(GAME_ADMIN, tx.origin);

    village = _village;
    currency = IERC20Upgradeable(currencyAddress);
  }

  function stake(uint amount) public returns (bool stakeCompleted) {
    stakeCompleted = false;
    uint256 currentStakeId = currentStake[tx.origin];
    if (stakes[currentStakeId + 1].amount != 0) {
      require(stakedCurrencies[tx.origin] + amount == stakes[currentStakeId + 1].amount, 'You need to stake required currency amount');
    }
    if (currentStakeId == 0) {
      firstStake();
    } else {
      if(!currentStakeRewardClaimed[tx.origin]) {
        completeStake();
        stakeCompleted = true;
      }
      assignNextStake(currentStakeId);
    }
    currentStakeStart[tx.origin] = block.timestamp;
    currency.transferFrom(tx.origin, address(this), amount);
    stakedCurrencies[tx.origin] = stakedCurrencies[tx.origin].add(amount);
    emit Staked(tx.origin, amount);
  }
  //extract
  function firstStake() public {
    require(unlockedTiers[tx.origin] == 0, 'You have already staked');
    currentStake[tx.origin] = 1;
    emit FirstStake(tx.origin);
  }
  //extract
  function completeStake() public {
    require(block.timestamp > currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration, 'Stake not completed');
    require(!currentStakeRewardClaimed[tx.origin], 'Reward already claimed');
    unlockedTiers[tx.origin] += 1;
    currentStakeRewardClaimed[tx.origin] = true;
    emit StakeComplete(tx.origin, currentStake[tx.origin]);
  }
  //extract
  function assignNextStake(uint currentStakeId) public {
    if (stakes[currentStakeId + 1].duration == 0) {
      currentStake[tx.origin] = 0;
    } else {
      currentStake[tx.origin] += 1;
    }
    currentStakeRewardClaimed[tx.origin] = false;
  }

  function unstake() virtual public returns (bool stakeCompleted) {
    if (!currentStakeRewardClaimed[tx.origin] && (block.timestamp > currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration)) {
      completeStake();
      stakeCompleted = true;
    } else {
      stakeCompleted = false;
    }
    currentStake[tx.origin] = 0;
    currentStakeStart[tx.origin] = 0;
    currency.transfer(tx.origin, stakedCurrencies[tx.origin]);
    emit Unstaked(tx.origin, stakedCurrencies[tx.origin]);
    stakedCurrencies[tx.origin] = 0;
  }
  //extract
  function getStakeCompleteTimestamp() public view returns (uint256) {
    return currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration;
  }

  function getRequiredStakeAmount() public view returns (uint256) {
    return stakes[currentStake[tx.origin] + 1].amount - stakedCurrencies[tx.origin];
  }

  function canCompleteStake() public view returns (bool) {
    return !currentStakeRewardClaimed[tx.origin] && (block.timestamp > currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration);
  }

}
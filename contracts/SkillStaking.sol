// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./CurrencyStaking.sol";
import "./KingStaking.sol";
import "./KingToken.sol";

contract SkillStaking is CurrencyStaking {
  using SafeMath for uint256;

  KingStaking public kingStaking;
  KingToken public kingToken;

  mapping(address => uint) public kingVaults;
  mapping(uint => uint) public kingRewards;

  function initialize(Village _village, KingStaking _kingStaking, address currencyAddress, address kingAddress) public initializer {
    super.initialize(_village, currencyAddress);
    kingStaking = _kingStaking;
    kingToken = KingToken(kingAddress);
  }

  function stake(uint amount) public override returns (uint finishTimestamp) {
    require(kingStaking.getUnlockedTiers() >= getNextRequirement(), "You must unlock at least 4 tiers of king before staking skill");
    uint beforeStakeUnlocked = unlockedTiers[msg.sender];
    finishTimestamp = super.stake(amount);
    uint afterStakeUnlocked = unlockedTiers[msg.sender];
    if (beforeStakeUnlocked < afterStakeUnlocked) {
      kingVaults[msg.sender] = kingVaults[msg.sender].add(kingRewards[afterStakeUnlocked]);
    }
  }

  function addStake(uint id, uint duration, uint requirement, uint amount, uint kingReward) public {
    stakes[id] = Stake({duration : duration, requirement : requirement, amount : amount});
    kingRewards[id] = kingReward;
  }

  function unstake() public override returns (bool stakeCompleted) {
    stakeCompleted = super.unstake();
    if (stakeCompleted) {
      kingVaults[msg.sender] = kingVaults[msg.sender].add(kingRewards[unlockedTiers[msg.sender]]);
    }
  }

  function completeStake() public override {
    super.completeStake();
    kingVaults[msg.sender] = kingVaults[msg.sender].add(kingRewards[unlockedTiers[msg.sender]]);
  }

  function claimKingVault() public {
    require(kingVaults[msg.sender] > 0, "You don't have any king in the vault to claim");
    kingToken.transfer(msg.sender, kingVaults[msg.sender]);
    kingVaults[msg.sender] = 0;
  }
}

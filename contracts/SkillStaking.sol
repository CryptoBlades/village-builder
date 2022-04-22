// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./CurrencyStaking.sol";
import "./KingStaking.sol";

contract SkillStaking is CurrencyStaking {

  KingStaking public kingStaking;

  function initialize(Village _village, KingStaking _kingStaking, address currencyAddress) public initializer {
    super.initialize(_village, currencyAddress);
    kingStaking = _kingStaking;
  }

  function stake(uint amount) public override returns (uint finishTimestamp) {
    require(kingStaking.unlockedTiers(msg.sender) >= 4, "You must unlock at least 4 tiers of king before staking skill");
    finishTimestamp = super.stake(amount);
  }

  function addStake(uint id, uint duration, uint amount) public {
    stakes[id] = Stake({duration : duration, requirement : 0, amount : amount});
  }

  function unstake() public override returns (bool stakeCompleted) {
    stakeCompleted = super.unstake();
  }

  function claimStakeReward() public {
    completeStake();
  }
}

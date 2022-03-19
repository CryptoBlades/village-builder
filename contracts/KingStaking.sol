// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./CurrencyStaking.sol";

contract KingStaking is CurrencyStaking {

  function initialize(Village _village, address currencyAddress) override public initializer {
    super.initialize(_village, currencyAddress);
  }

  function addStake(uint id, uint duration, uint amount) public {
    stakes[id] = Stake({duration : duration, requirement : 0, amount : amount});
  }

  function stake(uint amount, Village.Building building) public {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    uint256 finishTimestamp = stake(amount);
    village.setCurrentlyUpgrading(stakedLandId, building, finishTimestamp);
  }

  function unstake() public override returns (bool stakeCompleted) {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    stakeCompleted = super.unstake();
    if (stakeCompleted) {
      village.finishBuildingUpgrade(stakedLandId);
    }
    village.setCurrentlyUpgrading(stakedLandId, Village.Building.NONE, 0);
  }

  function claimStakeReward() public {
    completeStake();
    village.finishBuildingUpgrade(village.stakedLand(msg.sender));
  }
}

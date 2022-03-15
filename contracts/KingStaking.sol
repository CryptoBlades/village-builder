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
    if (stake(amount)) {
      village.upgradeBuilding(stakedLandId);
    }
    village.setCurrentlyUpgrading(stakedLandId, building);
  }

  function unstake() public override returns (bool stakeCompleted) {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    stakeCompleted = super.unstake();
    if (stakeCompleted) {
      village.upgradeBuilding(stakedLandId);
    }
    village.setCurrentlyUpgrading(stakedLandId, Village.Building.NONE);
  }

  function claimStakeReward() public {
    completeStake();
    village.upgradeBuilding(village.stakedLand(msg.sender));
  }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./NftStaking.sol";

contract CharacterStaking is NftStaking {

  function initialize(Village _village, address nftAddress) override public initializer {
    super.initialize(_village, nftAddress);
  }

  function stake(uint[] memory ids) public override {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    require(stakedLandId > 0, "You need to stake land");
    uint256 barracksLevel = village.getBuildingLevel(stakedLandId, Village.Building(BARRACKS));
    require(barracksLevel >= getNextRequirement(), 'You need to upgrade barracks');
    super.stake(ids);
  }

  function getNextRequirement() public view returns (uint256) {
    return stakes[currentStake[msg.sender] + 1].requirement;
  }

  //TODO: Override unstake, check for stakeComplete event and react accordingly
}

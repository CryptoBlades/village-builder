// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./NftStaking.sol";

contract CharacterStaking is NftStaking {

  function initialize(Village _village, address nftAddress) override public initializer {
    super.initialize(_village, nftAddress);

    stakes[1] = Stake({duration : 30, requirement : 1, amount : 1});
    stakes[2] = Stake({duration : 120, requirement : 1, amount : 2});
    stakes[3] = Stake({duration : 300, requirement : 1, amount : 3});
  }

  function stake(uint[] memory ids) public override {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    uint256 barracksLevel = village.getBuildingLevel(stakedLandId, BARRACKS);
    require(barracksLevel >= stakes[currentStake[msg.sender] + 1].requirement, 'You need to upgrade barracks');
    super.stake(ids);
  }

  //TODO: Override unstake, check for stakeComplete event and react accordingly
}

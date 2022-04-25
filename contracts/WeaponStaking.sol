// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./CharacterStaking.sol";
import "./NftStaking.sol";

contract WeaponStaking is NftStaking {

  CharacterStaking public characterStaking;

  function initialize(Village _village, address nftAddress, CharacterStaking _characterStaking) public initializer {
    super.initialize(_village, nftAddress);

    characterStaking = _characterStaking;

    stakes[1] = Stake({duration : 30, requirement : 1, amount : 1});
    stakes[2] = Stake({duration : 120, requirement : 2, amount : 2});
    stakes[3] = Stake({duration : 300, requirement : 3, amount : 3});
  }

  function stake(uint[] memory ids) public override {
    uint256 stakedCharacters = characterStaking.getStakedNftsAmount(msg.sender);
    require(stakedCharacters >= stakes[currentStake[msg.sender] + 1].requirement, 'You need to stake more characters');
    super.stake(ids);
  }

  function getNextRequirement() public view returns (uint256) {
    return stakes[currentStake[msg.sender] + 1].requirement;
  }
}

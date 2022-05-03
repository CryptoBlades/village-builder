// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Village.sol";
import "./CharacterStaking.sol";
import "./NftStaking.sol";
import "./KingVault.sol";

contract WeaponStaking is NftStaking {

  CharacterStaking public characterStaking;
  KingVault public kingVault;

  function initialize(Village _village, address nftAddress, CharacterStaking _characterStaking, KingVault _kingVault) public initializer {
    super.initialize(_village, nftAddress);

    characterStaking = _characterStaking;
    kingVault = _kingVault;
  }

  function stake(uint[] memory ids) public override {
    uint256 stakedCharacters = characterStaking.getStakedAmount(msg.sender);
    require(stakedCharacters >= getNextRequirement(), 'You need to stake more characters');
    super.stake(ids);
  }
}

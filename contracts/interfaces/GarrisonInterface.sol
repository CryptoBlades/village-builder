// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721ReceiverUpgradeable.sol";

interface GarrisonInterface is IERC721ReceiverUpgradeable {
  function getUserCharacters() external view returns (uint256[] memory tokens);
}

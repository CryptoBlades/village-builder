pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721EnumerableUpgradeable.sol";

interface CBKLandInterface is IERC721EnumerableUpgradeable {
  function get(uint256 id) external view returns (uint256, uint256, uint256, uint256, address);

  function ownerOf(uint256 id) external view returns (address);

  function getOwned(address owner) external view returns (uint256[] memory ownedIds);

  function updateCXY(uint256 id, uint256 chunkId, uint256 world, uint256 x, uint256 y, bool setBuildings, bool forced) external;
}

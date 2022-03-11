pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721EnumerableUpgradeable.sol";

interface WeaponsInterface is IERC721EnumerableUpgradeable {
  function get(uint256 id) external view returns (uint256, uint256, uint256, uint256, address);
}

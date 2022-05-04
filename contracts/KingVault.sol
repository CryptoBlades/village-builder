// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./KingToken.sol";

contract KingVault is Initializable, AccessControlUpgradeable {
  using SafeMath for uint256;

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

  KingToken public kingToken;

  mapping(address => uint256) public vaults;

  function initialize(address kingAddress) public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, tx.origin);
    _setupRole(GAME_ADMIN, tx.origin);

    kingToken = KingToken(kingAddress);
  }

  function claimVault() public {
    require(vaults[msg.sender] > 0, "You don't have any king in the vault to claim");
    kingToken.transfer(msg.sender, vaults[msg.sender]);
    vaults[msg.sender] = 0;
  }

  function addToVault(address receiver, uint amount) public {
    vaults[receiver] += amount;
  }

}
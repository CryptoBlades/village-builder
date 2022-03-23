// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./Village.sol";

contract NftStaking is Initializable, AccessControlUpgradeable, IERC721ReceiverUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
  uint8 public constant BARRACKS = 3;

  Village public village;
  IERC721EnumerableUpgradeable public nft;

  struct Stake {
    uint256 duration;
    uint256 amount;
    uint256 requirement;
  }

  mapping(address => uint256[]) public stakedNfts;
  mapping(uint256 => Stake) public stakes;
  mapping(address => uint256) public currentStake;
  mapping(address => uint256) public currentStakeStart;
  mapping(address => uint256) public unlockedTiers;

  event FirstStake(address indexed user);
  event Staked(address indexed user, uint256[] ids);
  event StakeComplete(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256[] ids);

  function initialize(Village _village, address nftAddress) virtual public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, tx.origin);
    _setupRole(GAME_ADMIN, tx.origin);

    village = _village;
    nft = IERC721EnumerableUpgradeable(nftAddress);
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return IERC721ReceiverUpgradeable.onERC721Received.selector;
  }

  function firstStake() public {
    require(unlockedTiers[tx.origin] == 0, 'You have already staked');
    currentStake[tx.origin] = 1;
    emit FirstStake(tx.origin);
  }

  function stake(uint[] memory ids) virtual public {
    uint256 currentStakeId = currentStake[tx.origin];
    if (stakes[currentStakeId + 1].amount != 0) {
      require(stakedNfts[tx.origin].length + ids.length == stakes[currentStakeId + 1].amount, 'You need to stake all the required NFTs');
    }
    if (currentStakeId == 0) {
      firstStake();
    } else {
      completeStake(currentStakeId);
      assignNextStake(currentStakeId);
    }
    currentStakeStart[tx.origin] = block.timestamp;
    for (uint i = 0; i < ids.length; i++) {
      uint id = ids[i];
      nft.safeTransferFrom(tx.origin, address(this), id);
      stakedNfts[tx.origin].push(id);
    }
    emit Staked(tx.origin, ids);
  }

  function completeStake(uint currentStakeId) public {
    require(block.timestamp > currentStakeStart[tx.origin] + stakes[currentStakeId].duration, 'Stake not completed');
    unlockedTiers[tx.origin] += 1;
    emit StakeComplete(tx.origin, currentStake[tx.origin]);
  }

  function assignNextStake(uint currentStakeId) public {
    if (stakes[currentStakeId + 1].duration == 0) {
      currentStake[tx.origin] = 0;
    } else {
      currentStake[tx.origin] += 1;
    }
  }

  function unstake() public {
    uint256 currentStakeId = currentStake[tx.origin];
    if (block.timestamp > currentStakeStart[tx.origin] + stakes[currentStakeId].duration) {
      completeStake(currentStakeId);
    }
    currentStake[tx.origin] = 0;
    currentStakeStart[tx.origin] = 0;
    for (uint i = 0; i < stakedNfts[tx.origin].length; i++) {
      uint256 id = stakedNfts[tx.origin][i];
      nft.safeTransferFrom(address(this), tx.origin, id);
    }
    emit Unstaked(tx.origin, stakedNfts[tx.origin]);
    delete stakedNfts[tx.origin];
  }

  function getStakeCompleteTimestamp() public view returns (uint256) {
    return currentStakeStart[tx.origin] + stakes[currentStake[tx.origin]].duration;
  }

  function getStakedNftsAmount(address user) public view returns (uint256) {
    return stakedNfts[user].length;
  }

  function getRequiredStakeAmount() public view returns (uint256) {
    return stakes[currentStake[tx.origin] + 1].amount - stakedNfts[tx.origin].length;
  }

  function addStake(uint id, uint duration, uint requirement, uint amount) public {
    stakes[id] = Stake({duration : duration, requirement : requirement, amount : amount});
  }
}

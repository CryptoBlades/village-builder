pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./interfaces/WeaponsInterface.sol";
import "./Village.sol";
import "./CharacterStaking.sol";

contract WeaponStaking is Initializable, AccessControlUpgradeable, IERC721ReceiverUpgradeable { // is NftStaking?

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

  Village public village;
  CharacterStaking public characterStaking;
  WeaponsInterface public weapons;


  struct Stake {
    uint256 duration;
    uint256 requirement;
  }

  mapping(address => uint256[]) public stakedWeapons;
  mapping(uint256 => Stake) public stakes;
  mapping(address => uint256) public currentStake;
  mapping(address => uint256) public currentStakeStart;
  //  mapping(uint256 => uint256) public tiers;
  //  mapping(uint256 => uint256) public barracksRequirements;
  mapping(address => uint256) public unlockedTiers;

  event StakeComplete(address indexed user, uint256 indexed id);
  event Staked(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 indexed id);

  function initialize(Village _village, CharacterStaking _characterStaking) public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(GAME_ADMIN, msg.sender);

    village = _village;
    characterStaking = _characterStaking;

    stakes[1] = Stake({duration : 30, requirement : 1});
    stakes[2] = Stake({duration : 120, requirement : 2});
    stakes[3] = Stake({duration : 300, requirement : 3});
  }

  function assignWeaponsAddress(address weaponsAddress) external {
    weapons = WeaponsInterface(weaponsAddress);
  }

  modifier assertOwnsWeapons(address user, uint[] memory ids) {
    _assertOwnsWeapons(user, ids);
    _;
  }

  function _assertOwnsWeapons(address user, uint[] memory ids) internal view {
    for (uint i = 0; i < ids.length; i++) {
      require(weapons.ownerOf(ids[i]) == user, 'Not weapon owner');
    }
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return IERC721ReceiverUpgradeable.onERC721Received.selector;
  }

  function stake(uint[] memory ids) public assertOwnsWeapons(msg.sender, ids) {
    uint256 stakedLandId = village.stakedLand(msg.sender); // UNUSED
    uint256 stakedCharacters = characterStaking.getStakedCharactersAmount(msg.sender);
    uint256 currentStakeId = currentStake[msg.sender];
    uint256 timestamp = block.timestamp;
    if (currentStakeId == 0) {
      // first stake
      require(unlockedTiers[msg.sender] == 0, 'You have already staked');
      require(stakedCharacters >= stakes[1].requirement, 'You need to stake more characters');
      currentStakeStart[msg.sender] = timestamp;
      currentStake[msg.sender] = 1;
    } else {
      uint256 previousStakeTimestamp = currentStakeStart[msg.sender];
      uint256 previousStakeRequirement = stakes[currentStakeId].duration;
      require(timestamp > previousStakeTimestamp + previousStakeRequirement, 'Stake not completed');
      require(stakedCharacters >= stakes[currentStakeId + 1].requirement, 'You need to stake more characters');
      emit StakeComplete(msg.sender, currentStake[msg.sender]);
      unlockedTiers[msg.sender] += 1;
      if (stakes[currentStakeId + 1].duration == 0) {
        // path finished
        currentStake[msg.sender] = 0;
      } else {
        // go up a tier
        currentStake[msg.sender] += 1;
      }
      currentStakeStart[msg.sender] = timestamp;
    }
    for (uint i = 0; i < ids.length; i++) {
      uint id = ids[i];
      weapons.safeTransferFrom(msg.sender, address(this), id);
      stakedWeapons[msg.sender].push(id);
      emit Staked(msg.sender, id);
    }
  }

  function unstake() public {
    uint256 currentStakeId = currentStake[msg.sender];
    uint256 timestamp = block.timestamp;
    uint256 previousStakeTimestamp = currentStakeStart[msg.sender];
    uint256 previousStakeRequirement = stakes[currentStakeId].duration;
    if (timestamp > previousStakeTimestamp + previousStakeRequirement) {
      emit StakeComplete(msg.sender, currentStakeId);
      unlockedTiers[msg.sender] += 1;
    }
    currentStake[msg.sender] = 0;
    currentStakeStart[msg.sender] = 0;
    uint256 numberOfStakedWeapons = stakedWeapons[msg.sender].length;
    for (uint i = 0; i < numberOfStakedWeapons; i++) {
      uint256 id = stakedWeapons[msg.sender][i];
      weapons.safeTransferFrom(address(this), msg.sender, id);
      emit Unstaked(msg.sender, id);
    }
    delete stakedWeapons[msg.sender];
  }

  function getStakeCompleteTimestamp() public view returns (uint256) {
    uint256 currentStakeId = currentStake[msg.sender];
    return currentStakeStart[msg.sender] + stakes[currentStakeId].duration;
  }

  function getStakedCharactersAmount(address user) public view returns (uint256) {
    return stakedWeapons[user].length;
  }
}

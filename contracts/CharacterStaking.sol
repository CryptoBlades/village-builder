pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "./interfaces/CharactersInterface.sol";
import "./Village.sol";

contract CharacterStaking is Initializable, AccessControlUpgradeable, IERC721ReceiverUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
  uint8 public constant BARRACKS = 3;

  Village public village;
  CharactersInterface public characters;


  struct Stake {
    uint256 duration;
    uint256 requirement;
  }


  mapping(address => uint256[]) public stakedCharacters;
  mapping(uint256 => Stake) public stakes;
  mapping(address => uint256) public currentStake;
  mapping(address => uint256) public currentStakeStart;
  //  mapping(uint256 => uint256) public tiers;
  //  mapping(uint256 => uint256) public barracksRequirements;
  mapping(address => uint256) public unlockedTiers;

  event StakeComplete(address indexed user, uint256 indexed id);
  event Staked(address indexed user, uint256 indexed id);
  event Unstaked(address indexed user, uint256 indexed id);

  function initialize(Village _village) public initializer {
    __AccessControl_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(GAME_ADMIN, msg.sender);

    village = _village;

    stakes[1] = Stake({duration : 30, requirement : 1});
    stakes[2] = Stake({duration : 120, requirement : 1});
    stakes[3] = Stake({duration : 300, requirement : 1});


    //    tiers[1] = 30;
    //    tiers[2] = 120;
    //    tiers[3] = 300;
    //    tiers[4] = 600;
    //    tiers[5] = 1500;
    //    tiers[6] = 2700;
    //    tiers[7] = 5400;
    //    tiers[8] = 18000;
    //    tiers[9] = 36000;
    //    tiers[10] = 72000;
    //    tiers[11] = 90000;
    //    tiers[12] = 108000;
    //    tiers[13] = 126000;
    //    tiers[14] = 144000;
    //    tiers[15] = 162000;
    //    tiers[16] = 180000;
    //    tiers[17] = 186000;
    //    tiers[18] = 192000;
    //    tiers[19] = 198000;
    //    tiers[20] = 204000;
    //    tiers[21] = 210000;
    //    tiers[22] = 216000;
    //    tiers[23] = 222000;
    //    tiers[24] = 228000;
    //    tiers[25] = 234000;
    //    tiers[26] = 240000;
    //    tiers[27] = 270000;
    //    tiers[28] = 300000;
    //    tiers[29] = 330000;
    //    tiers[30] = 360000;
    //
    //    barracksRequirements[1] = 1;
    //    barracksRequirements[2] = 1;
    //    barracksRequirements[3] = 1;
    //    barracksRequirements[4] = 1;
    //    barracksRequirements[5] = 1;
    //    barracksRequirements[6] = 1;
    //    barracksRequirements[7] = 2;
    //    barracksRequirements[8] = 2;
    //    barracksRequirements[9] = 2;
    //    barracksRequirements[10] = 2;
    //    barracksRequirements[11] = 2;
    //    barracksRequirements[12] = 2;
    //    barracksRequirements[13] = 3;
    //    barracksRequirements[14] = 3;
    //    barracksRequirements[15] = 3;
    //    barracksRequirements[16] = 3;
    //    barracksRequirements[17] = 3;
    //    barracksRequirements[18] = 3;
    //    barracksRequirements[19] = 4;
    //    barracksRequirements[20] = 4;
    //    barracksRequirements[21] = 4;
    //    barracksRequirements[22] = 4;
    //    barracksRequirements[23] = 4;
    //    barracksRequirements[24] = 4;
    //    barracksRequirements[25] = 5;
    //    barracksRequirements[26] = 5;
    //    barracksRequirements[27] = 5;
    //    barracksRequirements[28] = 5;
    //    barracksRequirements[29] = 5;
    //    barracksRequirements[30] = 5;
  }

  function assignCharactersAddress(address charactersAddress) external {
    characters = CharactersInterface(charactersAddress);
  }

  modifier assertOwnsCharacter(address user, uint256 id) {
    _assertOwnsCharacter(user, id);
    _;
  }

  function _assertOwnsCharacter(address user, uint256 id) internal view {
    require(characters.ownerOf(id) == user, 'Not character owner');
  }

  function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
    return IERC721ReceiverUpgradeable.onERC721Received.selector;
  }

  function stake(uint id) public assertOwnsCharacter(msg.sender, id) {
    uint256 stakedLandId = village.stakedLand(msg.sender);
    uint256 barracksLevel = village.getBuildingLevel(stakedLandId, BARRACKS);
    uint256 currentStakeId = currentStake[msg.sender];
    uint256 timestamp = block.timestamp;
    if (currentStakeId == 0) {
      require(unlockedTiers[msg.sender] == 0, 'You have already staked');
      require(barracksLevel >= stakes[1].requirement, 'You need to upgrade barracks');
      currentStakeStart[msg.sender] = timestamp;
      currentStake[msg.sender] = 1;
    } else {
      uint256 previousStakeTimestamp = currentStakeStart[msg.sender];
      uint256 previousStakeRequirement = stakes[currentStakeId].duration;
      require(timestamp > previousStakeTimestamp + previousStakeRequirement, 'Stake not completed');
      require(barracksLevel >= stakes[currentStakeId + 1].requirement, 'You need to upgrade barracks');
      emit StakeComplete(msg.sender, currentStake[msg.sender]);
      unlockedTiers[msg.sender] += 1;
      if (stakes[currentStakeId + 1].duration == 0) {
        currentStake[msg.sender] = 0;
      } else {
        currentStake[msg.sender] += 1;
      }
      currentStakeStart[msg.sender] = timestamp;
    }
    characters.safeTransferFrom(msg.sender, address(this), id);
    stakedCharacters[msg.sender].push(id);
    emit Staked(msg.sender, id);
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
    uint256 numberOfStakedCharacters = stakedCharacters[msg.sender].length;
    for (uint i = 0; i < numberOfStakedCharacters; i++) {
      uint256 id = stakedCharacters[msg.sender][i];
      characters.safeTransferFrom(address(this), msg.sender, id);
      emit Unstaked(msg.sender, id);
    }
    delete stakedCharacters[msg.sender];
  }

  function getStakeCompleteTimestamp() public view returns (uint256) {
    uint256 currentStakeId = currentStake[msg.sender];
    return currentStakeStart[msg.sender] + stakes[currentStakeId].duration;
  }

  function getStakedCharactersAmount(address user) public view returns (uint256) {
    return stakedCharacters[user].length;
  }
}

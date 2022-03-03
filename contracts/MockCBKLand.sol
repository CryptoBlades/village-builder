pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

// This is a mock contract for development purposes
// ONLY use the land interface
contract MockCBKLand is Initializable, ERC721EnumerableUpgradeable, AccessControlUpgradeable {

  bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
  bytes32 public constant NO_OWNED_LIMIT = keccak256("NO_OWNED_LIMIT");

  // Land specific
  uint256 public constant LT = 0; // Land Tier
  uint256 public constant LC = 1; // Land Chunk Id
  uint256 public constant LX = 2; // Land Coordinate X
  uint256 public constant LY = 3; // Land Coordinate Y
  uint256 public constant LW = 4; // Land World

  event LandMinted(address indexed minter, uint256 id, uint256 tier, uint256 chunkId);
  event LandTransfered(address indexed from, address indexed to, uint256 id);
  event LandTokenMinted(address indexed reseller, address indexed minter, uint256 id, uint256 tier);
  event LandMintedWithReseller(address indexed minter, uint256 id, uint256 tier, uint256 chunkId, address reseller);
  event LandChunkIdUpdated(uint256 indexed id, uint256 chunkId);

  // TotalLand
  uint256 landMinted;
  // Avoiding structs for stats
  mapping(uint256 => mapping(uint256 => uint256)) landData;

  mapping(uint256 => mapping(uint256 => string)) landStrData;

  uint256 public constant LBT = 0; // Land is a Token, it will have its chunkId updated later
  uint256 public constant LBB = 1; // Land is banned
  mapping(uint256 => mapping(uint256 => bool)) landBoolData;

  uint256 public constant LAR = 0; // Land Reseller, the one who minted the token
  mapping(uint256 => mapping(uint256 => address)) landAddressData;

  uint256 public constant TSU = 0; // URI of a tier. Will put this in land NFT because it kinda belongs here
  mapping(uint256 => mapping(uint256 => string)) tierStrData;

  // village id => buildingid => level
  mapping(uint256 => mapping(uint256 => uint256)) buildingLevels;

  function initialize () public initializer {
    __ERC721_init("CryptoBladesKingdoms MOCK Land", "CBKML");
    __AccessControl_init_unchained();

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  modifier restricted() {
    _restricted();
    _;
  }

  function _restricted() internal view {
    require(hasRole(GAME_ADMIN, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NA");
  }

  // tier, world, chunkid, x, y, reseller address
  function get(uint256 id) public view returns (uint256, uint256, uint256, uint256, uint256, address) {
    return (landData[id][LT], landData[id][LW], landData[id][LC], landData[id][LX], landData[id][LY], landAddressData[id][LAR]);
  }

  function getOwned(address owner) public view returns (uint256[] memory ownedIds) {
    uint256 ownedLandCount = balanceOf(owner);
    ownedIds = new uint256[](ownedLandCount);
    for(uint256 i = 0; i < ownedLandCount; i++) {
      ownedIds[i] = tokenOfOwnerByIndex(owner, i);
    }
  }

  function getLandBanned(uint256 id) public view returns (bool) {
    return landBoolData[id][LBB];
  }

  function setLandBanned(uint256 id, bool isBanned) public restricted {
    landBoolData[id][LBB] = isBanned;
  }

  function getLandReseller(uint256 land) public view returns (address) {
    return landAddressData[land][LAR];
  }

  // DO NOT call directly outside the logic of CBKLandSale to avoid breaking tier and chunk logic
  function mint(address minter, uint256 tier, uint256 chunkId) public restricted {
    uint256 tokenID = landMinted++;

    landData[tokenID][LT] = tier;
    landData[tokenID][LC] = chunkId;

    _mint(minter, tokenID);
    emit LandMinted(minter, tokenID, tier, chunkId);
  }

  function mint(address minter, uint256 tier, uint256 chunkId, address reseller) public restricted {
    uint256 tokenID = landMinted++;

    landData[tokenID][LT] = tier;
    landData[tokenID][LC] = chunkId;

    landAddressData[tokenID][LAR] = reseller;

    _mint(minter, tokenID);
    emit LandMintedWithReseller(minter, tokenID, tier, chunkId, reseller);
  }

  function massMint(address minter, uint256 tier, uint256 chunkId, address reseller, uint256 quantity) public restricted {
    for(uint256 i = 0; i < quantity; i++) {
      mint(minter, tier, chunkId, reseller);
    }
  }

  function updateChunkId(uint256 id, uint256 chunkId) public restricted {
    landData[id][LC] = chunkId;
    emit LandChunkIdUpdated(id, chunkId);
  }

  function updateChunkId(uint256[] memory ids, uint256 chunkId) public restricted {
    for(uint256 i = 0; i < ids.length; i++) {
      updateChunkId(ids[i], chunkId);
    }
  }

  function updateCXY(uint256 id, uint256 chunkId, uint256 world, uint256 x, uint256 y, bool setBuildings, bool forced) external restricted {
    require(forced || (landData[id][LX] == 0 && landData[id][LY] == 0), "NAL");
    landData[id][LC] = chunkId;
    landData[id][LX] = x;
    landData[id][LY] = y;
    landData[id][LW] = world;

    if(setBuildings){
      if(landData[id][LT] == 3) {
        buildingLevels[id][0] = 3; // Town hall
        buildingLevels[id][2] = 3; // Barracks
        buildingLevels[id][1] = 1; // Head quarters
        buildingLevels[id][3] = 3; // Stone mine
        buildingLevels[id][4] = 3; // Clay pit
        buildingLevels[id][5] = 3; // Forest cap
        buildingLevels[id][7] = 3; // Store House
        buildingLevels[id][10] = 3; // Farm
        buildingLevels[id][11] = 3; // Hidden Stash
        buildingLevels[id][12] = 3; // Wall
        buildingLevels[id][13] = 3; // Market
      }
      else {
        buildingLevels[id][0] = 1; // Town hall
        buildingLevels[id][3] = 1; // Stone mine
        buildingLevels[id][4] = 1; // Clay pit
        buildingLevels[id][5] = 1; // Forest cap
        buildingLevels[id][7] = 1; // Store House
        buildingLevels[id][10] = 1; // Farm
      }
    }
  }

  // Helper function for bulk moving land without having to jump chains
  function landsBelongToChunk(uint256[] memory ids, uint256 chunkId) public view returns (bool) {
    for(uint256 i = 0; i < ids.length; i++) {
      if(landData[ids[i]][LC] != chunkId) {
        return false;
      }

      if(ids[i] > landMinted) {
        return false;
      }
    }

    return true;
  }

  function getLandTierURI(uint256 id) public view returns (string memory uri) {
    (uint256 tier,,,,,) = get(id);
    return getTierURI(tier);
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    return getLandTierURI(id);
  }

  function getTierURI(uint256 tier) public view returns (string memory uri) {
    return tierStrData[tier][TSU];
  }

  function setTierStr(uint256 tier, uint256 index, string memory val) public restricted {
    tierStrData[tier][index] = val;
  }

  function setBuildingLevel(uint256[] calldata lands, uint256 building, uint256 level) external restricted {
    for (uint256 i = 0; i < lands.length; i++) {
      setBuildingLevel(lands[i], building, level);
    }
  }

  function setBuildingLevel(uint256 land, uint256 building, uint256 level) internal {
    buildingLevels[land][building] = level;
  }

  function getBuildingLevel(uint256 land, uint256 building) public view returns (uint256) {
    return buildingLevels[land][building];
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable, ERC721EnumerableUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

}

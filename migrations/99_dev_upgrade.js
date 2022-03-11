const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  const village = await upgradeProxy(Village.address, Village, {deployer});
  await village.assignCBKLandAddress('0x4eBE163A7Cd57602e52CfFe34a38268C21897927');
  const characterStaking = await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await characterStaking.assignCharactersAddress('0x0DDEFe3b35E8603a14368Ea48B08eEf81D9744B5');
};

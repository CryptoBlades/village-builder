const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  await deployProxy(CharacterStaking, [village.address, '0x0DDEFe3b35E8603a14368Ea48B08eEf81D9744B5'], {deployer});
};

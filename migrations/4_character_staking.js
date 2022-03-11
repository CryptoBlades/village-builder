const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  await deployProxy(CharacterStaking, [village.address], {deployer});
};

const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const WeaponStaking = artifacts.require('WeaponStaking');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const characterStaking = await CharacterStaking.deployed();
  await deployProxy(WeaponStaking, [village.address, '0x4f669d30778210D7F336Aa86153C0c8e190aad95', characterStaking.address], {deployer});
};

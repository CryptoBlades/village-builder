const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const WeaponStaking = artifacts.require('WeaponStaking');
const CharacterStaking = artifacts.require('CharacterStaking');
const KingVault = artifacts.require('KingVault');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const characterStaking = await CharacterStaking.deployed();
  const weaponsAddress = '0xC74273bBDD31f1bEC912E5ce63C08FF87Bfb8796';
  await deployProxy(WeaponStaking, [village.address, weaponsAddress, characterStaking.address], {deployer});
};

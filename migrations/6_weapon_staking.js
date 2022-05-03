const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const WeaponStaking = artifacts.require('WeaponStaking');
const CharacterStaking = artifacts.require('CharacterStaking');
const KingVault = artifacts.require('KingVault');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const characterStaking = await CharacterStaking.deployed();
  const kingVault = await KingVault.deployed();
  const weaponsAddress = '0x10Af96d6266EeE66cbF8c76Bbbe19882990626B8';
  await deployProxy(WeaponStaking, [village.address, weaponsAddress, characterStaking.address, kingVault.address], {deployer});
};

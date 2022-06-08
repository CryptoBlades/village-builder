const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const development = require('../src/assets/addresses/development.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const WeaponStaking = artifacts.require('WeaponStaking');
const CharacterStaking = artifacts.require('CharacterStaking');
const KingVault = artifacts.require('KingVault');
module.exports = async function (deployer, network) {
  const village = await Village.deployed();
  const characterStaking = await CharacterStaking.deployed();
  const kingVault = await KingVault.deployed();
  if (network === "development") {
    await deployProxy(WeaponStaking, [village.address, development.weaponsAddress, characterStaking.address, kingVault.address], {deployer});
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(WeaponStaking, [village.address, test.weaponsAddress, characterStaking.address, kingVault.address], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(WeaponStaking, [village.address, production.weaponsAddress, characterStaking.address, kingVault.address], {deployer});
  }
};

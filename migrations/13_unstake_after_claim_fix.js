const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const WeaponStaking = artifacts.require('WeaponStaking');

module.exports = async function (deployer) {
  await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
};

const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const KingStaking = artifacts.require('KingStaking');
const SkillStaking = artifacts.require('SkillStaking');
const WeaponStaking = artifacts.require('WeaponStaking');

module.exports = async function (deployer) {
  await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await upgradeProxy(KingStaking.address, KingStaking, {deployer});
  await upgradeProxy(SkillStaking.address, SkillStaking, {deployer});
  await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
};

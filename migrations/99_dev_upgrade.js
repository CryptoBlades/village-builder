const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const WeaponStaking = artifacts.require('WeaponStaking');
const KingStaking = artifacts.require('KingStaking');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  await upgradeProxy(Village.address, Village, {deployer});
  await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
  const kingStaking = await upgradeProxy(KingStaking.address, KingStaking, {deployer});
  await kingStaking.addStake(1, 6, web3.utils.toWei('1', 'ether'));
  await kingStaking.addStake(2, 12, web3.utils.toWei('2', 'ether'));
  await kingStaking.addStake(3, 18, web3.utils.toWei('3', 'ether'));
  await kingStaking.addStake(4, 24, web3.utils.toWei('4', 'ether'));
  await kingStaking.addStake(5, 30, web3.utils.toWei('5', 'ether'));
  await kingStaking.addStake(6, 60, web3.utils.toWei('10', 'ether'));
  await kingStaking.addStake(7, 120, web3.utils.toWei('12', 'ether'));
  await kingStaking.addStake(8, 240, web3.utils.toWei('14', 'ether'));
  await kingStaking.addStake(9, 300, web3.utils.toWei('18', 'ether'));
  await kingStaking.addStake(10, 420, web3.utils.toWei('20', 'ether'));
  await kingStaking.addStake(11, 600, web3.utils.toWei('23', 'ether'));
};

const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const WeaponStaking = artifacts.require('WeaponStaking');
const KingStaking = artifacts.require('KingStaking');
const SkillStaking = artifacts.require('SkillStaking');
const Village = artifacts.require('Village');

module.exports = async function (deployer) {
  await upgradeProxy(Village.address, Village, {deployer});
  const characterStaking = await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
  const kingStaking = await upgradeProxy(KingStaking.address, KingStaking, {deployer});

  const skillStaking = await upgradeProxy(SkillStaking.address, SkillStaking, {deployer});

  await characterStaking.addStake(5, 300, 1, 5);
  await characterStaking.addStake(6, 300, 1, 6);
  await characterStaking.addStake(7, 300, 2, 7);
  await characterStaking.addStake(8, 300, 2, 8);
  await characterStaking.addStake(9, 300, 2, 9);
  await characterStaking.addStake(10, 300, 2, 10);
  await characterStaking.addStake(11, 300, 2, 11);
  await characterStaking.addStake(12, 300, 2, 12);
  await characterStaking.addStake(13, 300, 3, 13);
  await characterStaking.addStake(14, 300, 3, 14);

  // REAL VALUES
  await characterStaking.addStake(1, 30, 1, 1);
  await characterStaking.addStake(2, 120, 1, 2);
  await characterStaking.addStake(3, 300, 1, 3);
  await characterStaking.addStake(4, 600, 1, 4);
  // await characterStaking.addStake(5, 1500, 1, 5);
  // await characterStaking.addStake(6, 2700, 1, 6);
  // await characterStaking.addStake(7, 5400, 2, 7);
  // await characterStaking.addStake(8, 18000, 2, 8);
  // await characterStaking.addStake(9, 36000, 2, 9);
  // await characterStaking.addStake(10, 72000, 2, 10);
  // await characterStaking.addStake(11, 90000, 2, 11);
  // await characterStaking.addStake(12, 108000, 2, 12);
  // await characterStaking.addStake(13, 126000, 3, 13);
  // await characterStaking.addStake(14, 144000, 3, 14);
  // await characterStaking.addStake(15, 162000, 3, 15);
  // await characterStaking.addStake(16, 180000, 3, 16);
  // await characterStaking.addStake(17, 186000, 3, 17);
  // await characterStaking.addStake(18, 192000, 3, 18);
  // await characterStaking.addStake(19, 198000, 4, 19);
  // await characterStaking.addStake(20, 204000, 4, 20);
  // await characterStaking.addStake(21, 210000, 4, 21);
  // await characterStaking.addStake(22, 216000, 4, 22);
  // await characterStaking.addStake(23, 222000, 4, 23);
  // await characterStaking.addStake(24, 228000, 4, 24);
  // await characterStaking.addStake(25, 234000, 5, 25);
  // await characterStaking.addStake(26, 240000, 5, 26);
  // await characterStaking.addStake(27, 270000, 5, 27);
  // await characterStaking.addStake(28, 300000, 5, 28);
  // await characterStaking.addStake(29, 330000, 5, 29);
  // await characterStaking.addStake(30, 360000, 5, 30);

  await kingStaking.addStake(1, 6, web3.utils.toWei('1', 'ether'));
  await kingStaking.addStake(2, 12, web3.utils.toWei('2', 'ether'));
  await kingStaking.addStake(3, 18, web3.utils.toWei('3', 'ether'));
  await kingStaking.addStake(4, 24, web3.utils.toWei('4', 'ether'));
  await kingStaking.addStake(5, 30, web3.utils.toWei('5', 'ether'));
  await kingStaking.addStake(6, 60, web3.utils.toWei('10', 'ether'));
  await kingStaking.addStake(7, 120, web3.utils.toWei('12', 'ether'));
  await kingStaking.addStake(8, 180, web3.utils.toWei('14', 'ether'));
  await kingStaking.addStake(9, 240, web3.utils.toWei('18', 'ether'));
  await kingStaking.addStake(10, 300, web3.utils.toWei('20', 'ether'));
  await kingStaking.addStake(11, 420, web3.utils.toWei('23', 'ether'));
  await kingStaking.addStake(12, 600, web3.utils.toWei('26', 'ether'));
  await kingStaking.addStake(13, 780, web3.utils.toWei('29', 'ether'));
  await kingStaking.addStake(14, 960, web3.utils.toWei('32', 'ether'));
  await kingStaking.addStake(15, 1140, web3.utils.toWei('35', 'ether'));
  await kingStaking.addStake(16, 1380, web3.utils.toWei('40', 'ether'));
  await kingStaking.addStake(17, 1680, web3.utils.toWei('45', 'ether'));
  await kingStaking.addStake(18, 2040, web3.utils.toWei('50', 'ether'));
  await kingStaking.addStake(19, 2400, web3.utils.toWei('55', 'ether'));
  await kingStaking.addStake(20, 3000, web3.utils.toWei('60', 'ether'));

  await skillStaking.addStake(1, 30, 4, web3.utils.toWei('0.01', 'ether'));
  await skillStaking.addStake(2, 60, 4, web3.utils.toWei('0.05', 'ether'));
  await skillStaking.addStake(3, 120, 4, web3.utils.toWei('0.1', 'ether'));
  await skillStaking.addStake(4, 180, 4, web3.utils.toWei('0.2', 'ether'));
  await skillStaking.addStake(5, 240, 4, web3.utils.toWei('0.3', 'ether'));
  await skillStaking.addStake(6, 300, 4, web3.utils.toWei('0.4', 'ether'));
  await skillStaking.addStake(7, 600, 4, web3.utils.toWei('0.5', 'ether'));
};

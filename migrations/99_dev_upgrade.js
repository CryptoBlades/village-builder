const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const WeaponStaking = artifacts.require('WeaponStaking');
const KingStaking = artifacts.require('KingStaking');
const SkillStaking = artifacts.require('SkillStaking');
const Village = artifacts.require('Village');

module.exports = async function (deployer) {
  await upgradeProxy(Village.address, Village, {deployer});
  const characterStaking = await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  const weaponStaking = await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
  const kingStaking = await upgradeProxy(KingStaking.address, KingStaking, {deployer});
  const skillStaking = await upgradeProxy(SkillStaking.address, SkillStaking, {deployer});

  await Promise.all([
    characterStaking.addStake(5, 300, 1, 5),
    characterStaking.addStake(6, 300, 1, 6),
    characterStaking.addStake(7, 300, 2, 7),
    characterStaking.addStake(8, 300, 2, 8),
    characterStaking.addStake(9, 300, 2, 9),
    characterStaking.addStake(10, 300, 2, 10),
    characterStaking.addStake(11, 300, 2, 11),
    characterStaking.addStake(12, 300, 2, 12),
    characterStaking.addStake(13, 300, 3, 13),
    characterStaking.addStake(14, 300, 3, 14),

    // REAL VALUES
    characterStaking.addStake(1, 30, 1, 1),
    characterStaking.addStake(2, 120, 1, 2),
    characterStaking.addStake(3, 300, 1, 3),
    characterStaking.addStake(4, 600, 1, 4),
    // characterStaking.addStake(5, 1500, 1, 5),
    // characterStaking.addStake(6, 2700, 1, 6),
    // characterStaking.addStake(7, 5400, 2, 7),
    // characterStaking.addStake(8, 18000, 2, 8),
    // characterStaking.addStake(9, 36000, 2, 9),
    // characterStaking.addStake(10, 72000, 2, 10),
    // characterStaking.addStake(11, 90000, 2, 11),
    // characterStaking.addStake(12, 108000, 2, 12),
    // characterStaking.addStake(13, 126000, 3, 13),
    // characterStaking.addStake(14, 144000, 3, 14),
    // characterStaking.addStake(15, 162000, 3, 15),
    // characterStaking.addStake(16, 180000, 3, 16),
    // characterStaking.addStake(17, 186000, 3, 17),
    // characterStaking.addStake(18, 192000, 3, 18),
    // characterStaking.addStake(19, 198000, 4, 19),
    // characterStaking.addStake(20, 204000, 4, 20),
    // characterStaking.addStake(21, 210000, 4, 21),
    // characterStaking.addStake(22, 216000, 4, 22),
    // characterStaking.addStake(23, 222000, 4, 23),
    // characterStaking.addStake(24, 228000, 4, 24),
    // characterStaking.addStake(25, 234000, 5, 25),
    // characterStaking.addStake(26, 240000, 5, 26),
    // characterStaking.addStake(27, 270000, 5, 27),
    // characterStaking.addStake(28, 300000, 5, 28),
    // characterStaking.addStake(29, 330000, 5, 29),
    // characterStaking.addStake(30, 360000, 5, 30),
    kingStaking.addStake(1, 6, web3.utils.toWei('1', 'ether')),
    kingStaking.addStake(2, 12, web3.utils.toWei('2', 'ether')),
    kingStaking.addStake(3, 18, web3.utils.toWei('3', 'ether')),
    kingStaking.addStake(4, 24, web3.utils.toWei('4', 'ether')),
    kingStaking.addStake(5, 30, web3.utils.toWei('5', 'ether')),
    kingStaking.addStake(6, 60, web3.utils.toWei('10', 'ether')),
    kingStaking.addStake(7, 120, web3.utils.toWei('12', 'ether')),
    kingStaking.addStake(8, 180, web3.utils.toWei('14', 'ether')),
    kingStaking.addStake(9, 240, web3.utils.toWei('18', 'ether')),
    kingStaking.addStake(10, 300, web3.utils.toWei('20', 'ether')),
    kingStaking.addStake(11, 420, web3.utils.toWei('23', 'ether')),
    kingStaking.addStake(12, 600, web3.utils.toWei('26', 'ether')),
    kingStaking.addStake(13, 780, web3.utils.toWei('29', 'ether')),
    kingStaking.addStake(14, 960, web3.utils.toWei('32', 'ether')),
    kingStaking.addStake(15, 1140, web3.utils.toWei('35', 'ether')),
    kingStaking.addStake(16, 1380, web3.utils.toWei('40', 'ether')),
    kingStaking.addStake(17, 1680, web3.utils.toWei('45', 'ether')),
    kingStaking.addStake(18, 2040, web3.utils.toWei('50', 'ether')),
    kingStaking.addStake(19, 2400, web3.utils.toWei('55', 'ether')),
    kingStaking.addStake(20, 3000, web3.utils.toWei('60', 'ether')),

    skillStaking.addStake(1, 30, 4, web3.utils.toWei('0.01', 'ether'), 0),
    skillStaking.addStake(2, 60, 4, web3.utils.toWei('0.05', 'ether'), web3.utils.toWei('1', 'ether')),
    skillStaking.addStake(3, 120, 4, web3.utils.toWei('0.1', 'ether'), 0),
    skillStaking.addStake(4, 180, 4, web3.utils.toWei('0.2', 'ether'), web3.utils.toWei('2', 'ether')),
    skillStaking.addStake(5, 240, 4, web3.utils.toWei('0.3', 'ether'), 0),
    skillStaking.addStake(6, 300, 4, web3.utils.toWei('0.4', 'ether'), web3.utils.toWei('3', 'ether')),
    skillStaking.addStake(7, 600, 4, web3.utils.toWei('0.5', 'ether'), 0),

    weaponStaking.addStake(1, 30, 1, 1),
    weaponStaking.addStake(2, 120, 2, 2),
    weaponStaking.addStake(3, 300, 3, 3),
    weaponStaking.addStake(4, 600, 4, 4),
    weaponStaking.addStake(5, 1500, 5, 5),
  ]);
};

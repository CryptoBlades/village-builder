const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
const WeaponStaking = artifacts.require('WeaponStaking');
const KingStaking = artifacts.require('KingStaking');
const SkillStaking = artifacts.require('SkillStaking');
const Village = artifacts.require('Village');

module.exports = async function (deployer, network) {
  await upgradeProxy(Village.address, Village, {deployer});
  const characterStaking = await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  const weaponStaking = await upgradeProxy(WeaponStaking.address, WeaponStaking, {deployer});
  const kingStaking = await upgradeProxy(KingStaking.address, KingStaking, {deployer});
  const skillStaking = await upgradeProxy(SkillStaking.address, SkillStaking, {deployer});

  await Promise.all([
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
    // CHARACTER_STAKING FINISHED

    kingStaking.addStake(1, 6, 0, web3.utils.toWei('1', 'ether')),
    kingStaking.addStake(2, 12, 0, web3.utils.toWei('2', 'ether')),
    kingStaking.addStake(3, 18, 0, web3.utils.toWei('3', 'ether')),
    kingStaking.addStake(4, 24, 0, web3.utils.toWei('4', 'ether')),
    kingStaking.addStake(5, 30, 0, web3.utils.toWei('5', 'ether')),
    kingStaking.addStake(6, 60, 0, web3.utils.toWei('10', 'ether')),
    kingStaking.addStake(7, 120, 0, web3.utils.toWei('12', 'ether')),
    kingStaking.addStake(8, 180, 0, web3.utils.toWei('14', 'ether')),
    kingStaking.addStake(9, 240, 0, web3.utils.toWei('18', 'ether')),
    kingStaking.addStake(10, 300, 0, web3.utils.toWei('20', 'ether')),
    kingStaking.addStake(11, 420, 0, web3.utils.toWei('23', 'ether')),
    kingStaking.addStake(12, 600, 0, web3.utils.toWei('26', 'ether')),
    kingStaking.addStake(13, 780, 0, web3.utils.toWei('29', 'ether')),
    kingStaking.addStake(14, 960, 0, web3.utils.toWei('32', 'ether')),
    kingStaking.addStake(15, 1140, 0, web3.utils.toWei('35', 'ether')),
    kingStaking.addStake(16, 1380, 0, web3.utils.toWei('40', 'ether')),
    kingStaking.addStake(17, 1680, 0, web3.utils.toWei('45', 'ether')),
    kingStaking.addStake(18, 2040, 0, web3.utils.toWei('50', 'ether')),
    kingStaking.addStake(19, 2400, 0, web3.utils.toWei('55', 'ether')),
    kingStaking.addStake(20, 3000, 0, web3.utils.toWei('60', 'ether')),
    // kingStaking.addStake(21, 3660, 0, web3.utils.toWei('65', 'ether')),
    // kingStaking.addStake(22, 4320, 0, web3.utils.toWei('70', 'ether')),
    // kingStaking.addStake(23, 4980, 0, web3.utils.toWei('75', 'ether')),
    // kingStaking.addStake(24, 5640, 0, web3.utils.toWei('80', 'ether')),
    // kingStaking.addStake(25, 6300, 0, web3.utils.toWei('85', 'ether')),
    // kingStaking.addStake(26, 7200, 0, web3.utils.toWei('90', 'ether')),
    // kingStaking.addStake(27, 9000, 0, web3.utils.toWei('95', 'ether')),
    // kingStaking.addStake(28, 10800, 0, web3.utils.toWei('100', 'ether')),
    // kingStaking.addStake(29, 12600, 0, web3.utils.toWei('120', 'ether')),
    // kingStaking.addStake(30, 15000, 0, web3.utils.toWei('140', 'ether')),
    // kingStaking.addStake(31, 17400, 0, web3.utils.toWei('160', 'ether')),
    // kingStaking.addStake(32, 19800, 0, web3.utils.toWei('180', 'ether')),
    // kingStaking.addStake(33, 24000, 0, web3.utils.toWei('200', 'ether')),
    // kingStaking.addStake(34, 30600, 0, web3.utils.toWei('230', 'ether')),
    // kingStaking.addStake(35, 37200, 0, web3.utils.toWei('260', 'ether')),
    // kingStaking.addStake(36, 43800, 0, web3.utils.toWei('290', 'ether')),
    // kingStaking.addStake(37, 50400, 0, web3.utils.toWei('320', 'ether')),
    // kingStaking.addStake(38, 57000, 0, web3.utils.toWei('350', 'ether')),
    // kingStaking.addStake(39, 66000, 0, web3.utils.toWei('400', 'ether')),
    // kingStaking.addStake(40, 75000, 0, web3.utils.toWei('450', 'ether')),
    // kingStaking.addStake(41, 87000, 0, web3.utils.toWei('500', 'ether')),
    // kingStaking.addStake(42, 102000, 0, web3.utils.toWei('550', 'ether')),
    // kingStaking.addStake(43, 120000, 0, web3.utils.toWei('600', 'ether')),
    // kingStaking.addStake(44, 144000, 0, web3.utils.toWei('700', 'ether')),
    // kingStaking.addStake(45, 168000, 0, web3.utils.toWei('800', 'ether')),
    // kingStaking.addStake(46, 192000, 0, web3.utils.toWei('900', 'ether')),
    // kingStaking.addStake(47, 216000, 0, web3.utils.toWei('1000', 'ether')),
    // kingStaking.addStake(48, 240000, 0, web3.utils.toWei('1200', 'ether')),
    // kingStaking.addStake(49, 246000, 0, web3.utils.toWei('1400', 'ether')),
    // kingStaking.addStake(50, 252000, 0, web3.utils.toWei('1600', 'ether')),
    // kingStaking.addStake(51, 258000, 0, web3.utils.toWei('1800', 'ether')),
    // kingStaking.addStake(52, 264000, 0, web3.utils.toWei('2000', 'ether')),
    // kingStaking.addStake(53, 270000, 0, web3.utils.toWei('2300', 'ether')),
    // kingStaking.addStake(54, 276000, 0, web3.utils.toWei('2600', 'ether')),
    // kingStaking.addStake(55, 282000, 0, web3.utils.toWei('2900', 'ether')),
    // kingStaking.addStake(56, 288000, 0, web3.utils.toWei('3200', 'ether')),
    // kingStaking.addStake(57, 294000, 0, web3.utils.toWei('3500', 'ether')),
    // kingStaking.addStake(58, 300000, 0, web3.utils.toWei('4000', 'ether')),
    // kingStaking.addStake(59, 306000, 0, web3.utils.toWei('5000', 'ether')),
    //KING_STAKING FINISHED


    skillStaking.addStake(1, 30, 4, web3.utils.toWei('0.01', 'ether'), 0),
    skillStaking.addStake(2, 60, 4, web3.utils.toWei('0.05', 'ether'), web3.utils.toWei('1', 'ether')),
    skillStaking.addStake(3, 120, 4, web3.utils.toWei('0.1', 'ether'), 0),
    skillStaking.addStake(4, 180, 4, web3.utils.toWei('0.2', 'ether'), web3.utils.toWei('2', 'ether')),
    skillStaking.addStake(5, 240, 4, web3.utils.toWei('0.3', 'ether'), 0),
    skillStaking.addStake(6, 300, 4, web3.utils.toWei('0.4', 'ether'), web3.utils.toWei('3', 'ether')),
    skillStaking.addStake(7, 600, 4, web3.utils.toWei('0.5', 'ether'), 0),


    weaponStaking.addStake(1, 30, 1, 1, 0),
    weaponStaking.addStake(2, 120, 2, 2, 0),
    weaponStaking.addStake(3, 300, 3, 3, 0),
    weaponStaking.addStake(4, 600, 4, 4, 0),
    weaponStaking.addStake(5, 1500, 5, 5, web3.utils.toWei('1', 'ether')),
  ]);

  if (network === "development") {
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
      characterStaking.addStake(15, 300, 3, 15),
      characterStaking.addStake(16, 300, 3, 16),
      characterStaking.addStake(17, 300, 3, 17),
      characterStaking.addStake(18, 300, 3, 18),
      characterStaking.addStake(19, 300, 3, 19),
      characterStaking.addStake(20, 300, 3, 20),
    ]);
  }
};

const SkillStaking = artifacts.require('SkillStaking');
const WeaponStaking = artifacts.require('WeaponStaking');
const KingStaking = artifacts.require('KingStaking');
const KingVault = artifacts.require('KingVault');
const CharacterStaking = artifacts.require('CharacterStaking');

module.exports = async (deployer) => {
  const kingStaking = await KingStaking.deployed();
  const skillStaking = await SkillStaking.deployed();
  const weaponStaking = await WeaponStaking.deployed();
  const kingVault = await KingVault.deployed();
  const characterStaking = await CharacterStaking.deployed();

  await kingVault.grantRole(await kingVault.GAME_ADMIN(), skillStaking.address);
  await kingVault.grantRole(await kingVault.GAME_ADMIN(), weaponStaking.address);

  await Promise.all([
    characterStaking.addStake(1, 30, 1, 1),
    characterStaking.addStake(2, 120, 1, 2),
    characterStaking.addStake(3, 300, 1, 3),
    characterStaking.addStake(4, 600, 1, 4),
    characterStaking.addStake(5, 1500, 1, 5),
    characterStaking.addStake(6, 2700, 1, 6),
    characterStaking.addStake(7, 5400, 2, 7),
    characterStaking.addStake(8, 18000, 2, 8),
    characterStaking.addStake(9, 36000, 2, 9),
    characterStaking.addStake(10, 72000, 2, 10),
    characterStaking.addStake(11, 90000, 2, 11),
    characterStaking.addStake(12, 108000, 2, 12),
    characterStaking.addStake(13, 126000, 3, 13),
    characterStaking.addStake(14, 144000, 3, 14),
    characterStaking.addStake(15, 162000, 3, 15),
    characterStaking.addStake(16, 180000, 3, 16),
    characterStaking.addStake(17, 186000, 3, 17),
    characterStaking.addStake(18, 192000, 3, 18),
    characterStaking.addStake(19, 198000, 4, 19),
    characterStaking.addStake(20, 204000, 4, 20),
    characterStaking.addStake(21, 210000, 4, 21),
    characterStaking.addStake(22, 216000, 4, 22),
    characterStaking.addStake(23, 222000, 4, 23),
    characterStaking.addStake(24, 228000, 4, 24),
    characterStaking.addStake(25, 234000, 5, 25),
    characterStaking.addStake(26, 240000, 5, 26),
    characterStaking.addStake(27, 270000, 5, 27),
    characterStaking.addStake(28, 300000, 5, 28),
    characterStaking.addStake(29, 330000, 5, 29),
    characterStaking.addStake(30, 360000, 5, 30),
    // CHARACTER_STAKING FINISHED
  ]);

  await Promise.all([
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
    kingStaking.addStake(21, 3660, 0, web3.utils.toWei('65', 'ether')),
    kingStaking.addStake(22, 4320, 0, web3.utils.toWei('70', 'ether')),
    kingStaking.addStake(23, 4980, 0, web3.utils.toWei('75', 'ether')),
    kingStaking.addStake(24, 5640, 0, web3.utils.toWei('80', 'ether')),
    kingStaking.addStake(25, 6300, 0, web3.utils.toWei('85', 'ether')),
    kingStaking.addStake(26, 7200, 0, web3.utils.toWei('90', 'ether')),
    kingStaking.addStake(27, 9000, 0, web3.utils.toWei('95', 'ether')),
    kingStaking.addStake(28, 10800, 0, web3.utils.toWei('100', 'ether')),
    kingStaking.addStake(29, 12600, 0, web3.utils.toWei('120', 'ether')),
    kingStaking.addStake(30, 15000, 0, web3.utils.toWei('140', 'ether')),
    kingStaking.addStake(31, 17400, 0, web3.utils.toWei('160', 'ether')),
    kingStaking.addStake(32, 19800, 0, web3.utils.toWei('180', 'ether')),
    kingStaking.addStake(33, 24000, 0, web3.utils.toWei('200', 'ether')),
    kingStaking.addStake(34, 30600, 0, web3.utils.toWei('230', 'ether')),
    kingStaking.addStake(35, 37200, 0, web3.utils.toWei('260', 'ether')),
    kingStaking.addStake(36, 43800, 0, web3.utils.toWei('290', 'ether')),
    kingStaking.addStake(37, 50400, 0, web3.utils.toWei('320', 'ether')),
    kingStaking.addStake(38, 57000, 0, web3.utils.toWei('350', 'ether')),
    kingStaking.addStake(39, 66000, 0, web3.utils.toWei('400', 'ether')),
    kingStaking.addStake(40, 75000, 0, web3.utils.toWei('450', 'ether')),
    kingStaking.addStake(41, 87000, 0, web3.utils.toWei('500', 'ether')),
    kingStaking.addStake(42, 102000, 0, web3.utils.toWei('550', 'ether')),
    kingStaking.addStake(43, 120000, 0, web3.utils.toWei('600', 'ether')),
    kingStaking.addStake(44, 144000, 0, web3.utils.toWei('700', 'ether')),
    kingStaking.addStake(45, 168000, 0, web3.utils.toWei('800', 'ether')),
    kingStaking.addStake(46, 192000, 0, web3.utils.toWei('900', 'ether')),
    kingStaking.addStake(47, 216000, 0, web3.utils.toWei('1000', 'ether')),
    kingStaking.addStake(48, 240000, 0, web3.utils.toWei('1200', 'ether')),
    kingStaking.addStake(49, 246000, 0, web3.utils.toWei('1400', 'ether')),
    kingStaking.addStake(50, 252000, 0, web3.utils.toWei('1600', 'ether')),
    kingStaking.addStake(51, 258000, 0, web3.utils.toWei('1800', 'ether')),
    kingStaking.addStake(52, 264000, 0, web3.utils.toWei('2000', 'ether')),
    kingStaking.addStake(53, 270000, 0, web3.utils.toWei('2300', 'ether')),
    kingStaking.addStake(54, 276000, 0, web3.utils.toWei('2600', 'ether')),
    kingStaking.addStake(55, 282000, 0, web3.utils.toWei('2900', 'ether')),
    kingStaking.addStake(56, 288000, 0, web3.utils.toWei('3200', 'ether')),
    kingStaking.addStake(57, 294000, 0, web3.utils.toWei('3500', 'ether')),
    kingStaking.addStake(58, 300000, 0, web3.utils.toWei('4000', 'ether')),
    kingStaking.addStake(59, 306000, 0, web3.utils.toWei('5000', 'ether')),
    //KING_STAKING FINISHED
  ]);

  await Promise.all([
    skillStaking.addStake(1, 30, 4, web3.utils.toWei('0.01', 'ether'), 0),
    skillStaking.addStake(2, 60, 4, web3.utils.toWei('0.05', 'ether'), web3.utils.toWei('1', 'ether')),
    skillStaking.addStake(3, 120, 4, web3.utils.toWei('0.1', 'ether'), 0),
    skillStaking.addStake(4, 180, 4, web3.utils.toWei('0.2', 'ether'), web3.utils.toWei('2', 'ether')),
    skillStaking.addStake(5, 240, 4, web3.utils.toWei('0.3', 'ether'), 0),
    skillStaking.addStake(6, 300, 4, web3.utils.toWei('0.4', 'ether'), web3.utils.toWei('3', 'ether')),
    skillStaking.addStake(7, 600, 4, web3.utils.toWei('0.5', 'ether'), 0),
    skillStaking.addStake(8, 720, 4, web3.utils.toWei('1', 'ether'), web3.utils.toWei('4', 'ether')),
    skillStaking.addStake(9, 900, 4, web3.utils.toWei('1.25', 'ether'), 0),
    skillStaking.addStake(10, 1200, 4, web3.utils.toWei('1.5', 'ether'), web3.utils.toWei('5', 'ether')),
    skillStaking.addStake(11, 1500, 4, web3.utils.toWei('1.75', 'ether'), 0),
    skillStaking.addStake(12, 1800, 4, web3.utils.toWei('2', 'ether'), web3.utils.toWei('6', 'ether')),
    skillStaking.addStake(13, 2700, 4, web3.utils.toWei('2.25', 'ether'), 0),
    skillStaking.addStake(14, 3600, 4, web3.utils.toWei('2.5', 'ether'), web3.utils.toWei('7', 'ether')),
    skillStaking.addStake(15, 4200, 4, web3.utils.toWei('2.75', 'ether'), 0),
    skillStaking.addStake(16, 4800, 4, web3.utils.toWei('3', 'ether'), web3.utils.toWei('8', 'ether')),
    skillStaking.addStake(17, 5400, 4, web3.utils.toWei('3.5', 'ether'), 0),
    skillStaking.addStake(18, 6000, 4, web3.utils.toWei('4', 'ether'), web3.utils.toWei('9', 'ether')),
    skillStaking.addStake(19, 6600, 4, web3.utils.toWei('4.5', 'ether'), 0),
    skillStaking.addStake(20, 7200, 4, web3.utils.toWei('5', 'ether'), web3.utils.toWei('10', 'ether')),
    skillStaking.addStake(21, 9000, 4, web3.utils.toWei('6', 'ether'), 0),
    skillStaking.addStake(22, 10800, 4, web3.utils.toWei('7', 'ether'), web3.utils.toWei('11', 'ether')),
    skillStaking.addStake(23, 12600, 4, web3.utils.toWei('8', 'ether'), 0),
    skillStaking.addStake(24, 14400, 4, web3.utils.toWei('9', 'ether'), web3.utils.toWei('12', 'ether')),
    skillStaking.addStake(25, 18000, 4, web3.utils.toWei('10', 'ether'), 0),
    skillStaking.addStake(26, 21600, 4, web3.utils.toWei('12', 'ether'), web3.utils.toWei('13', 'ether')),
    skillStaking.addStake(27, 25200, 4, web3.utils.toWei('14', 'ether'), 0),
    skillStaking.addStake(28, 30000, 4, web3.utils.toWei('16', 'ether'), web3.utils.toWei('14', 'ether')),
    skillStaking.addStake(29, 34800, 4, web3.utils.toWei('18', 'ether'), 0),
    skillStaking.addStake(30, 42000, 4, web3.utils.toWei('20', 'ether'), web3.utils.toWei('15', 'ether')),
    skillStaking.addStake(31, 49800, 4, web3.utils.toWei('23', 'ether'), 0),
    skillStaking.addStake(32, 57000, 4, web3.utils.toWei('26', 'ether'), web3.utils.toWei('16', 'ether')),
    skillStaking.addStake(33, 66000, 4, web3.utils.toWei('29', 'ether'), 0),
    skillStaking.addStake(34, 72000, 4, web3.utils.toWei('32', 'ether'), web3.utils.toWei('17', 'ether')),
    skillStaking.addStake(35, 78000, 4, web3.utils.toWei('35', 'ether'), 0),
    skillStaking.addStake(36, 84000, 4, web3.utils.toWei('39', 'ether'), web3.utils.toWei('18', 'ether')),
    skillStaking.addStake(37, 90000, 4, web3.utils.toWei('41', 'ether'), 0),
    skillStaking.addStake(38, 108000, 4, web3.utils.toWei('43', 'ether'), web3.utils.toWei('19', 'ether')),
    skillStaking.addStake(39, 126000, 4, web3.utils.toWei('45', 'ether'), 0),
    skillStaking.addStake(40, 144000, 4, web3.utils.toWei('47', 'ether'), web3.utils.toWei('20', 'ether')),
    skillStaking.addStake(41, 162000, 4, web3.utils.toWei('50', 'ether'), 0),
    skillStaking.addStake(42, 180000, 4, web3.utils.toWei('55', 'ether'), web3.utils.toWei('21', 'ether')),
    skillStaking.addStake(43, 204000, 4, web3.utils.toWei('60', 'ether'), 0),
    skillStaking.addStake(44, 228000, 4, web3.utils.toWei('65', 'ether'), web3.utils.toWei('22', 'ether')),
    skillStaking.addStake(45, 252000, 4, web3.utils.toWei('70', 'ether'), 0),
    skillStaking.addStake(46, 276000, 4, web3.utils.toWei('75', 'ether'), web3.utils.toWei('23', 'ether')),
    skillStaking.addStake(47, 300000, 4, web3.utils.toWei('80', 'ether'), 0),
    skillStaking.addStake(48, 330000, 4, web3.utils.toWei('85', 'ether'), web3.utils.toWei('24', 'ether')),
    skillStaking.addStake(49, 360000, 4, web3.utils.toWei('90', 'ether'), 0),
    skillStaking.addStake(50, 390000, 4, web3.utils.toWei('95', 'ether'), web3.utils.toWei('25', 'ether')),
    skillStaking.addStake(51, 420000, 4, web3.utils.toWei('100', 'ether'), 0),
    //SKILL_STAKING FINISHED
  ]);

  await Promise.all([
    weaponStaking.addStake(1, 30, 1, 1, 0),
    weaponStaking.addStake(2, 120, 2, 2, 0),
    weaponStaking.addStake(3, 300, 3, 3, 0),
    weaponStaking.addStake(4, 600, 4, 4, 0),
    weaponStaking.addStake(5, 1500, 5, 5, web3.utils.toWei('1', 'ether')),
    weaponStaking.addStake(6, 2700, 6, 6, 0),
    weaponStaking.addStake(7, 5400, 7, 7, 0),
    weaponStaking.addStake(8, 7200, 8, 8, 0),
    weaponStaking.addStake(9, 10800, 9, 9, 0),
    weaponStaking.addStake(10, 14400, 10, 10, web3.utils.toWei('2', 'ether')),
    weaponStaking.addStake(11, 18000, 11, 12, 0),
    weaponStaking.addStake(12, 24000, 11, 14, 0),
    weaponStaking.addStake(13, 30000, 11, 16, 0),
    weaponStaking.addStake(14, 36000, 12, 18, 0),
    weaponStaking.addStake(15, 42000, 12, 20, web3.utils.toWei('3', 'ether')),
    weaponStaking.addStake(16, 48000, 12, 22, 0),
    weaponStaking.addStake(17, 54000, 13, 24, 0),
    weaponStaking.addStake(18, 60000, 13, 26, 0),
    weaponStaking.addStake(19, 66000, 13, 28, 0),
    weaponStaking.addStake(20, 72000, 14, 30, web3.utils.toWei('4', 'ether')),
    weaponStaking.addStake(21, 90000, 14, 33, 0),
    weaponStaking.addStake(22, 108000, 14, 36, 0),
    weaponStaking.addStake(23, 126000, 15, 39, 0),
    weaponStaking.addStake(24, 144000, 15, 42, 0),
    weaponStaking.addStake(25, 162000, 15, 45, web3.utils.toWei('5', 'ether')),
    weaponStaking.addStake(26, 180000, 16, 48, 0),
    weaponStaking.addStake(27, 186000, 16, 51, 0),
    weaponStaking.addStake(28, 192000, 17, 54, 0),
    weaponStaking.addStake(29, 198000, 17, 57, 0),
    weaponStaking.addStake(30, 204000, 18, 60, web3.utils.toWei('6', 'ether')),
    weaponStaking.addStake(31, 210000, 18, 64, 0),
    weaponStaking.addStake(32, 216000, 19, 68, 0),
    weaponStaking.addStake(33, 222000, 19, 72, 0),
    weaponStaking.addStake(34, 228000, 20, 76, 0),
    weaponStaking.addStake(35, 234000, 20, 80, web3.utils.toWei('7', 'ether')),
    weaponStaking.addStake(36, 240000, 21, 85, 0),
    weaponStaking.addStake(37, 246000, 22, 90, 0),
    weaponStaking.addStake(38, 252000, 23, 95, 0),
    weaponStaking.addStake(39, 258000, 24, 100, 0),
    weaponStaking.addStake(40, 264000, 25, 110, web3.utils.toWei('8', 'ether')),
    weaponStaking.addStake(41, 270000, 26, 120, 0),
    weaponStaking.addStake(42, 300000, 27, 130, 0),
    weaponStaking.addStake(43, 318000, 28, 140, 0),
    weaponStaking.addStake(44, 336000, 29, 150, 0),
    weaponStaking.addStake(45, 354000, 30, 175, web3.utils.toWei('9', 'ether')),
    //WEAPONS_STAKING FINISHED
  ]);
};

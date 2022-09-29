const SkillStaking = artifacts.require('SkillStaking');
const WeaponStaking = artifacts.require('WeaponStaking');

module.exports = async (callback) => {
  console.log("Script started");
  const skillStaking = await SkillStaking.deployed();
  const weaponStaking = await WeaponStaking.deployed();
  console.log("SkillStaking address: ", skillStaking.address);
  console.log("WeaponStaking address: ", weaponStaking.address);

  await Promise.all([
    skillStaking.addStake(2, 60, 4, web3.utils.toWei('0.05', 'ether'), web3.utils.toWei('52', 'ether')),
    skillStaking.addStake(4, 180, 4, web3.utils.toWei('0.2', 'ether'), web3.utils.toWei('104', 'ether')),
    skillStaking.addStake(6, 300, 4, web3.utils.toWei('0.4', 'ether'), web3.utils.toWei('156', 'ether')),
    skillStaking.addStake(8, 720, 4, web3.utils.toWei('1', 'ether'), web3.utils.toWei('208', 'ether')),
    skillStaking.addStake(10, 1200, 4, web3.utils.toWei('1.5', 'ether'), web3.utils.toWei('260', 'ether')),
    skillStaking.addStake(12, 1800, 4, web3.utils.toWei('2', 'ether'), web3.utils.toWei('312', 'ether')),
    skillStaking.addStake(14, 3600, 4, web3.utils.toWei('2.5', 'ether'), web3.utils.toWei('364', 'ether')),
    skillStaking.addStake(16, 4800, 4, web3.utils.toWei('3', 'ether'), web3.utils.toWei('416', 'ether')),
    skillStaking.addStake(18, 6000, 4, web3.utils.toWei('4', 'ether'), web3.utils.toWei('468', 'ether')),
    skillStaking.addStake(20, 7200, 4, web3.utils.toWei('5', 'ether'), web3.utils.toWei('520', 'ether')),
    skillStaking.addStake(22, 10800, 4, web3.utils.toWei('7', 'ether'), web3.utils.toWei('572', 'ether')),
    skillStaking.addStake(24, 14400, 4, web3.utils.toWei('9', 'ether'), web3.utils.toWei('624', 'ether')),
    skillStaking.addStake(26, 21600, 4, web3.utils.toWei('12', 'ether'), web3.utils.toWei('676', 'ether')),
    skillStaking.addStake(28, 30000, 4, web3.utils.toWei('16', 'ether'), web3.utils.toWei('728', 'ether')),
    skillStaking.addStake(30, 42000, 4, web3.utils.toWei('20', 'ether'), web3.utils.toWei('780', 'ether')),
    skillStaking.addStake(32, 57000, 4, web3.utils.toWei('26', 'ether'), web3.utils.toWei('832', 'ether')),
    skillStaking.addStake(34, 72000, 4, web3.utils.toWei('32', 'ether'), web3.utils.toWei('884', 'ether')),
    skillStaking.addStake(36, 84000, 4, web3.utils.toWei('39', 'ether'), web3.utils.toWei('936', 'ether')),
    skillStaking.addStake(38, 108000, 4, web3.utils.toWei('43', 'ether'), web3.utils.toWei('988', 'ether')),
    skillStaking.addStake(40, 144000, 4, web3.utils.toWei('47', 'ether'), web3.utils.toWei('1040', 'ether')),
    skillStaking.addStake(42, 180000, 4, web3.utils.toWei('55', 'ether'), web3.utils.toWei('1092', 'ether')),
    skillStaking.addStake(44, 228000, 4, web3.utils.toWei('65', 'ether'), web3.utils.toWei('1144', 'ether')),
    skillStaking.addStake(46, 276000, 4, web3.utils.toWei('75', 'ether'), web3.utils.toWei('1196', 'ether')),
    skillStaking.addStake(48, 330000, 4, web3.utils.toWei('85', 'ether'), web3.utils.toWei('1248', 'ether')),
    skillStaking.addStake(50, 390000, 4, web3.utils.toWei('95', 'ether'), web3.utils.toWei('1300', 'ether')),
  ]);

  console.log("SkillStaking values added");

  await Promise.all([
    weaponStaking.addStake(5, 1500, 5, 5, web3.utils.toWei('520', 'ether')),
    weaponStaking.addStake(10, 14400, 10, 10, web3.utils.toWei('1040', 'ether')),
    weaponStaking.addStake(15, 42000, 12, 20, web3.utils.toWei('1560', 'ether')),
    weaponStaking.addStake(20, 72000, 14, 30, web3.utils.toWei('2080', 'ether')),
    weaponStaking.addStake(25, 162000, 15, 45, web3.utils.toWei('2600', 'ether')),
    weaponStaking.addStake(30, 204000, 18, 60, web3.utils.toWei('3120', 'ether')),
    weaponStaking.addStake(35, 234000, 20, 80, web3.utils.toWei('3640', 'ether')),
    weaponStaking.addStake(40, 264000, 25, 110, web3.utils.toWei('4160', 'ether')),
    weaponStaking.addStake(45, 354000, 30, 175, web3.utils.toWei('5000', 'ether')),
  ]);

  console.log("WeaponStaking values added");

  console.log("Script finished");
  callback();
}

const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const SkillStaking = artifacts.require('SkillStaking');
const KingStaking = artifacts.require('KingStaking');
const KingToken = artifacts.require('KingToken');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const kingStaking = await KingStaking.deployed();
  const kingToken = await KingToken.deployed();
  const skillAddress = '0x8819834956D2e62F5816Ed475bD281f6fC361539';
  await deployProxy(SkillStaking, [village.address, kingStaking.address, skillAddress, kingToken.address], {deployer});
};

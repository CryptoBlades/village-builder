const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const SkillStaking = artifacts.require('SkillStaking');
const KingStaking = artifacts.require('KingStaking');
const KingToken = artifacts.require('KingToken');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const kingStaking = await KingStaking.deployed();
  const skillAddress = '0xc26986D83c310BDfFB23FD9D34e19560E2c7ca8d';
  await deployProxy(SkillStaking, [village.address, kingStaking.address, skillAddress], {deployer});
};

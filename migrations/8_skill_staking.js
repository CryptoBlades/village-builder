const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const SkillStaking = artifacts.require('SkillStaking');
const KingStaking = artifacts.require('KingStaking');
const KingVault = artifacts.require('KingVault');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const kingStaking = await KingStaking.deployed();
  const kingVault = await KingVault.deployed();
  const skillAddress = '0x430bbBe641E60Efec65D6a6DE568E6345953d236';
  await deployProxy(SkillStaking, [village.address, kingStaking.address, skillAddress, kingVault.address], {deployer});
};

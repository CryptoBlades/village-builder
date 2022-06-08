const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const development = require('../src/assets/addresses/development.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const SkillStaking = artifacts.require('SkillStaking');
const KingStaking = artifacts.require('KingStaking');
const KingVault = artifacts.require('KingVault');
module.exports = async function (deployer, network) {
  const village = await Village.deployed();
  const kingStaking = await KingStaking.deployed();
  const kingVault = await KingVault.deployed();

  if (network === "development") {
    await deployProxy(SkillStaking, [village.address, kingStaking.address, development.skillAddress, kingVault.address], {deployer});
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(SkillStaking, [village.address, kingStaking.address, test.skillAddress, kingVault.address], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(SkillStaking, [village.address, kingStaking.address, production.skillAddress, kingVault.address], {deployer});
  }
};

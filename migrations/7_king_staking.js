const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const development = require('../src/assets/addresses/development.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const KingStaking = artifacts.require('KingStaking');
module.exports = async function (deployer, network) {
  const village = await Village.deployed();
  if (network === "development") {
    await deployProxy(KingStaking, [village.address, development.kingAddress], {deployer});
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(KingStaking, [village.address, test.kingAddress], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(KingStaking, [village.address, production.kingAddress], {deployer});
  }
};

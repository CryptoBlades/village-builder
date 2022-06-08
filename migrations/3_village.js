const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const development = require('../src/assets/addresses/development.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');

module.exports = async function (deployer, network) {
  if (network === "development") {
    await deployProxy(Village, [development.cbkLandAddress], {deployer});
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(Village, [test.cbkLandAddress], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(Village, [production.cbkLandAddress], {deployer});
  }
};

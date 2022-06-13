const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const test = require('../src/assets/addresses/test.ts');
const production = require('../src/assets/addresses/production.ts')
const KingVault = artifacts.require('KingVault');
const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer, network) {
  if (network === "development") {
    const kingToken = await KingToken.deployed();
    const kingVault = await deployProxy(KingVault, [kingToken.address], {deployer});
    await kingToken.transferFrom(kingToken.address, kingVault.address, web3.utils.toWei('100', 'ether'));
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(KingVault, [test.kingAddress], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(KingVault, [production.kingAddress], {deployer});
  }
};

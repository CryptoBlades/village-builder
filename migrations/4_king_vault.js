const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const KingVault = artifacts.require('KingVault');
const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer, network) {
  const kingToken = await KingToken.deployed();
  const kingVault = await deployProxy(KingVault, [kingToken.address], {deployer});

  if (network === "development") {
    kingToken.transferFrom(kingToken.address, kingVault.address, web3.utils.toWei('100', 'ether'));
  }
};

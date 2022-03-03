const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const MockCBKLand = artifacts.require('MockCBKLand');
module.exports = async function (deployer) {
  await deployProxy(MockCBKLand, [], {deployer});
};

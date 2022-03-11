const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  await deployProxy(Village, [], {deployer});
};

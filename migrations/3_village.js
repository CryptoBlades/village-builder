const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  await deployProxy(Village, ['0x4eBE163A7Cd57602e52CfFe34a38268C21897927'], {deployer});
};

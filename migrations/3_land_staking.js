const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const LandStaking = artifacts.require('LandStaking');
module.exports = async function (deployer) {
  await deployProxy(LandStaking, [], {deployer});
};

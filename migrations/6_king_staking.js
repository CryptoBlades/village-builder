const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const KingStaking = artifacts.require('KingStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const kingAddress = '0x07542fA1E9A8db56fC6685571e1205dAb59eC3Bd';
  await deployProxy(KingStaking, [village.address, kingAddress], {deployer});
};

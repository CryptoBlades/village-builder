const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const KingToken = artifacts.require('KingToken');
const KingStaking = artifacts.require('KingStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const king = await KingToken.deployed();
  // const kingAddress = '0xfaCc287B1164267A85fC21181B794420cA6FaB7A';
  await deployProxy(KingStaking, [village.address, king.address], {deployer});
};

const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const charactersAddress = '0x1F495Fd1aF9437E45Da7107A2DADe998bBC4B2B3';
  await deployProxy(CharacterStaking, [village.address, charactersAddress], {deployer});
};

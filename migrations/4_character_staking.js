const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const village = await Village.deployed();
  const charactersAddress = '0x089e7fe7b969d0bDcC47568571C560F1C8C5d99b';
  await deployProxy(CharacterStaking, [village.address, charactersAddress], {deployer});
};

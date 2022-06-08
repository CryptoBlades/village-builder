const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const development = require('../src/assets/addresses/development.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer, network) {
  const village = await Village.deployed();
  if (network === "development") {
    await deployProxy(CharacterStaking, [village.address, development.charactersAddress], {deployer});
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await deployProxy(CharacterStaking, [village.address, test.charactersAddress], {deployer});
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    await deployProxy(CharacterStaking, [village.address, production.charactersAddress], {deployer});
  }
};

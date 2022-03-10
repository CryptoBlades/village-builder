const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  await deployProxy(CharacterStaking, [], {deployer});
};

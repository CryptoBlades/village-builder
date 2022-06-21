const production = require('../src/assets/addresses/production.ts')
const test = require('../src/assets/addresses/test.ts')
const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
const KingStaking = artifacts.require('KingStaking');
const KingToken = artifacts.require('KingToken');
module.exports = async function (deployer, network) {
  const village = await Village.deployed();
  if (network === "development") {
    const kingToken = await KingToken.deployed();
    let kingStaking = await deployProxy(KingStaking, [village.address, kingToken.address], {deployer});
    await village.grantRole(await village.GAME_ADMIN(), kingStaking.address);
  } else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    let kingStaking = await deployProxy(KingStaking, [village.address, test.kingAddress], {deployer});
    await village.grantRole(await village.GAME_ADMIN(), kingStaking.address);
  } else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    let kingStaking = await deployProxy(KingStaking, [village.address, production.kingAddress], {deployer});
    await village.grantRole(await village.GAME_ADMIN(), kingStaking.address);
  }
};

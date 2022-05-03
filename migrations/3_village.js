const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  const cbkLandAddress = '0x468DdFdFFeC329D2991A85FEc83E242cBaEc5E9B';
  await deployProxy(Village, [cbkLandAddress], {deployer});
};

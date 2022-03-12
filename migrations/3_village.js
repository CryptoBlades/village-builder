const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Village = artifacts.require('Village');
module.exports = async function (deployer) {
  const cbkLandAddress = '0x47a09052DE14bFebA30c721b67fD2d85fA243E6A';
  await deployProxy(Village, [cbkLandAddress], {deployer});
};

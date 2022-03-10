const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const LandStaking = artifacts.require('LandStaking');
module.exports = async function (deployer) {
  const landStaking = await upgradeProxy(LandStaking.address, LandStaking, {deployer});
  await landStaking.assignCBKLandAddress('0x92a3e4F09b30a9591EbBC3BE61538f9292af9104');
};

const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const LandStaking = artifacts.require('LandStaking');
const CharacterStaking = artifacts.require('CharacterStaking');
module.exports = async function (deployer) {
  const landStaking = await upgradeProxy(LandStaking.address, LandStaking, {deployer});
  await landStaking.assignCBKLandAddress('0x92a3e4F09b30a9591EbBC3BE61538f9292af9104');
  const characterStaking = await upgradeProxy(CharacterStaking.address, CharacterStaking, {deployer});
  await characterStaking.assignCharactersAddress('0xDB00EaEce427d41180D4EDb2e51b68B1c277D85A');
};

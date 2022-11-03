const CBKLand = require('../../../../cryptoblades/build/contracts/CBKLand.json');
const Characters = require('../../../../cryptoblades/build/contracts/Characters.json');
const Weapons = require('../../../../cryptoblades/build/contracts/Weapons.json');
const SkillToken = require('../../../../cryptoblades/build/contracts/SkillToken.json');
const Garrison = require('../../../../cryptoblades/build/contracts/Garrison.json');

const networkId = '5777';

module.exports = {
  cbkLandAddress: CBKLand.networks[networkId]?.address,
  charactersAddress: Characters.networks[networkId]?.address,
  weaponsAddress: Weapons.networks[networkId]?.address,
  skillAddress: SkillToken.networks[networkId]?.address,
  garrisonAddress: Garrison.networks[networkId]?.address,
}

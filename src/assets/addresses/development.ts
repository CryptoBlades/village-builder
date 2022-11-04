let CBKLand;
let Characters;
let Weapons;
let SkillToken;
let Garrison;

if (process.env["NODE_ENV"] === "development") {
  CBKLand = require('../../../../cryptoblades/build/contracts/CBKLand.json');
  Characters = require('../../../../cryptoblades/build/contracts/Characters.json');
  Weapons = require('../../../../cryptoblades/build/contracts/Weapons.json');
  SkillToken = require('../../../../cryptoblades/build/contracts/SkillToken.json');
  Garrison = require('../../../../cryptoblades/build/contracts/Garrison.json');
}

const networkId = '5777';

module.exports = {
  cbkLandAddress: CBKLand?.networks[networkId]?.address,
  charactersAddress: Characters?.networks[networkId]?.address,
  weaponsAddress: Weapons?.networks[networkId]?.address,
  skillAddress: SkillToken?.networks[networkId]?.address,
  garrisonAddress: Garrison?.networks[networkId]?.address,
}

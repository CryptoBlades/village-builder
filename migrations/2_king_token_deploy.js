const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer) {
  await deployer.deploy(KingToken);
}

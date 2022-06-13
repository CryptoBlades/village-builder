const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer, network) {
  if (network === "development") {
    await deployer.deploy(KingToken);
  }
}

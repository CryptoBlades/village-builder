const KingToken = artifacts.require('KingToken');

module.exports = function (deployer) {
  deployer.deploy(KingToken);
}

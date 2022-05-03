const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer, network, accounts) {
  const kingToken = await deployer.deploy(KingToken);
  if (network === "development") {
    await kingToken.transferFrom(kingToken.address, accounts[0], web3.utils.toWei('1', 'kether')); // 1000 king
  }
}

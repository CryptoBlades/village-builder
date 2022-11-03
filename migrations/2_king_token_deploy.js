const KingToken = artifacts.require('KingToken');

module.exports = async function (deployer, network, accounts) {
  if (network === "development") {
    await deployer.deploy(KingToken);
    const king = await KingToken.deployed();
    await king.transferFrom(king.address, accounts[0], web3.utils.toWei('100', 'ether'));
  }
}

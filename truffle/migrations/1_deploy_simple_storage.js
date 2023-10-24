const MyAuction = artifacts.require("MyAuction");
const web3 = require("../logic/web3");
// const accts = await

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MyAuction, 200, accounts[0], "Jai", "11");
};

const { Web3 } = require("web3");
const ganacheUrl = "http://ganache:8545";
// const ganacheUrl = "http://127.0.0.1:7545";
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider);
lol = async () => {
  const accts = await web3.eth.getAccounts();
  console.log(accts);
};

lol();
module.exports = web3;

// For simplicity we use `web3` package here. However, if you are concerned with the size,
//  you may import individual packages like 'web3-eth', 'web3-eth-contract' and 'web3-providers-http'.
const { Web3 } = require("web3"); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require("fs");
const path = require("path");
const web3 = require("./web3");

// Set up a connection to the Ethereum network
const abi = require("../build/MyContractAbi.json");
const bytecodePath = path.join(__dirname, "../build/MyContractBytecode.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf8");
const MyContract = new web3.eth.Contract(abi);
async function deploy() {
  const providersAccounts = await web3.eth.getAccounts();
  const defaultAccount = providersAccounts[0];
  console.log("deployer account:", defaultAccount);

  const myContract = MyContract.deploy({
    data: "0x" + bytecode,
    arguments: ["11", defaultAccount, "11", "11"],
  });

  try {
    // Deploy the contract to the Ganache network
    const tx = await myContract.send({
      from: defaultAccount,
      gas: 1000000,
      gasPrice: 100000,
    });
    console.log("Contract deployed at address: " + tx.options.address);

    // Write the Contract address to a new file
    const deployedAddressPath = path.join(__dirname, "MyContractAddress.bin");
    fs.writeFileSync(deployedAddressPath, tx.options.address);
  } catch (error) {
    console.error(error);
  }
}

deploy();

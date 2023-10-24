// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

const solc = require("solc");
const fs = require("fs");
const path = require("path");

const compile = () => {
  const fileName = "Auction.sol";
  const contractName = "MyAuction";

  const contractPath = path.join(__dirname, "../contracts/Auction.sol");
  const sourceCode = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      [fileName]: {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

  const bytecode =
    compiledCode.contracts[fileName][contractName].evm.bytecode.object;

  const bytecodePath = path.join(__dirname, "../build/MyContractBytecode.bin");
  fs.writeFileSync(bytecodePath, bytecode);

  const abi = compiledCode.contracts[fileName][contractName].abi;

  const abiPath = path.join(__dirname, "../build/MyContractAbi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));
};

compile();

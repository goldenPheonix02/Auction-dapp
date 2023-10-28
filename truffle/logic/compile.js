const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const compile = () => {
  try {
    // build path where compiled contract will save
    const buildPath = path.resolve(__dirname, "../build");

    // remove the build folder if it exist
    fs.removeSync(buildPath);

    // path of the Smart Contract
    const contractPath = path.resolve(__dirname, "../contracts", "Auction.sol");

    // Read the Smart Contract
    const source = fs.readFileSync(contractPath, "utf8");

    // Compile the smart contract
    const input = {
      language: "Solidity",
      sources: {
        "Auction.sol": {
          content: source,
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

    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    output = output.contracts["Auction.sol"]["MyAuction"];

    // Create the build folder if it not exist
    fs.ensureDirSync(buildPath);
    console.log(output);

    // Save the output in json format
    fs.outputJSONSync(path.resolve(buildPath, "Auction" + ".json"), output);

    return "Contract compiled successfully!";
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = compile;

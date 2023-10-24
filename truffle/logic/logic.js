const contractAddress = "0x2aD2d59A71980D5E9FC545B096699cFf66038bA0";
const compiledContract = require("../../client/src/contracts/MyAuction.json");
const web3 = require("./web3");

const auctionLogic = {};

const getContractObject = async () => {
  const obj = new web3.eth.Contract(compiledContract.abi, contractAddress);
  const accts = await web3.eth.getAccounts();
  return { contractObj: obj, accts };
};

auctionLogic.bid = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  var result;
  try {
    result = await contractObj.methods.bid().send({
      from: req.body.account,
      value: req.body.value,
      gas: 1000000,
    });
  } catch (err) {
    return res.status(501).send({ err: err.innerError.message });
  }
  if (result.status == BigInt(1)) res.send({ status: "successffully bid" });
};

auctionLogic.getHighest = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  const highestBid = parseInt(await contractObj.methods.highestBid().call());
  const highestBidder = await contractObj.methods.highestBidder().call();
  res.send({ highestBid, highestBidder });
};

auctionLogic.cancelAuction = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  try {
    result = await contractObj.methods
      .destructAuction()
      .call({ from: req.body.account });
  } catch (err) {
    return res.status(501).send({ err: err.innerError.message });
  }
  res.send("Auction cancelled successfully");
};

auctionLogic.getTime = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  var startTime = await contractObj.methods.auction_start().call();
  var endTime = await contractObj.methods.auction_end().call();
  startTime = startTime.toString();
  endTime = endTime.toString();
  res.send({ startTime, endTime });
};

module.exports = auctionLogic;

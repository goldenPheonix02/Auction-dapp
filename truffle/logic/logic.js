const web3 = require("./web3");
const moment = require("moment");
const auctionLogic = {};
const compiledContract = require("../build/Auction.json");

const getContractObject = async () => {
  const contractReceipt = require("./receipt-ganache.json");

  const obj = new web3.eth.Contract(
    compiledContract.abi,
    contractReceipt.address
  );
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
    console.log(err);
    return res.status(501).send({ err: err.innerError.message });
  }
  if (result.status == BigInt(1)) res.send({ status: "successffully bid" });
};

auctionLogic.getHighest = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  const highestBid = parseInt(await contractObj.methods.highestBid().call());
  const highestBidder = await contractObj.methods.highestBidder().call();
  const owner = await contractObj.methods.getOwner().call();
  console.log(highestBid, highestBidder);
  res.send({ highestBid, highestBidder, owner });
};

auctionLogic.cancelAuction = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  try {
    result = await contractObj.methods
      .destructAuction()
      .call({ from: req.body.account });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ err: err.innerError.message });
  }
  res.send("Auction cancelled successfully");
};

function format_time(s) {
  const dtFormat = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "medium",
    timeZone: "UTC",
  });

  return dtFormat.format(new Date(s * 1e3));
}

auctionLogic.getTime = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  var startTime = await contractObj.methods.auction_start().call();
  var endTime = await contractObj.methods.auction_end().call();
  startTime = startTime.toString();
  endTime = endTime.toString();
  res.send({
    startTime: moment.unix(startTime).format("LLL"),
    endTime: moment.unix(endTime).format("LLL"),
  });
};

auctionLogic.getAccounts = async (req, res) =>
  res.send({ accounts: await web3.eth.getAccounts() });

module.exports = auctionLogic;

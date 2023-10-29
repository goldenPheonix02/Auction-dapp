const web3 = require("./web3");
const moment = require("moment");
const auctionLogic = {};
const compiledContract = require("../build/Auction.json");
const importFresh = require("import-fresh");

const getContractObject = async () => {
  try {
    const contractReceipt = importFresh("./receipt-ganache.json");
    const obj = new web3.eth.Contract(
      compiledContract.abi,
      contractReceipt.address
    );
    const accts = await web3.eth.getAccounts();
    return { contractObj: obj, accts };
  } catch (err) {
    console.log(err);
    return null;
  }
};

auctionLogic.bid = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  var result;
  try {
    result = await contractObj.methods.bid().send({
      from: req.body.account,
      value: parseInt(req.body.value),
      gas: 1000000,
      gasPrice: 100000,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ err: err?.innerError?.message });
  }
  if (result.status == BigInt(1)) res.send({ status: "successfully bid" });
};

auctionLogic.getHigh = async () => {
  const { contractObj, accts } = await getContractObject();
  try {
    const highestBid = parseInt(await contractObj.methods.highestBid().call());
    const highestBidder = await contractObj.methods.highestBidder().call();
    const owner = await contractObj.methods.getOwner().call();
    const { Brand, Rnumber } = await contractObj.methods.Mycar().call();
    // console.log(Brand, Rnumber);
    console.log(highestBid, highestBidder);
    return { highestBid, highestBidder, owner, Brand, Rnumber };
    return { highestBid, highestBidder, owner };
  } catch (err) {
    // res.status(500).send(err);
    console.error(err);
  }
};

auctionLogic.getHighest = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  if (!contractObj) return res.status(500).json("not found");

  try {
    const result = await auctionLogic.getHigh();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

auctionLogic.cancelAuction = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  try {
    result = await contractObj.methods
      .cancelAuction()
      .call({ from: req.body.account });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ err: err.innerError.message });
  }
  res.send("Auction cancelled successfully");
};

auctionLogic.destructAuction = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  try {
    result = await contractObj.methods
      .destructAuction()
      .call({ from: req.body.account });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ err: err.innerError.message });
  }
  res.send("Auction destructed successfully");
};

auctionLogic.getTime = async (req, res) => {
  const { contractObj, accts } = await getContractObject();
  if (!contractObj) return res.status(500).json("not found");
  var startTime = await contractObj.methods.auction_start().call();
  var endTime = await contractObj.methods.auction_end().call();
  startTime = startTime.toString();
  endTime = endTime.toString();
  console.log(startTime, endTime);
  return res.json({
    startTime: moment.unix(startTime).format("LLL"),
    endTime: moment.unix(endTime).format("LLL"),
  });
};

auctionLogic.getAccounts = async (req, res) =>
  res.send({ accounts: await web3.eth.getAccounts() });

module.exports = auctionLogic;

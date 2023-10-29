const express = require("express");
const router = express.Router();
const auctionLogic = require("../truffle/logic/logic");
module.exports = router;
const compile = require("../truffle/logic/compile");
const deploy = require("../truffle/logic/deploy");

router.get("/highest", auctionLogic.getHighest);
router.post("/bid", auctionLogic.bid);
router.post("/cancel", auctionLogic.cancelAuction);
router.post("/destruct", auctionLogic.destructAuction);
router.get("/time", auctionLogic.getTime);
router.get("/accounts", auctionLogic.getAccounts);
router.get("/compile", async (req, res) => {
  const result = compile();
  res.send(result);
});
router.post("/deploy", async (req, res) => {
  const { duration, brand, rn } = req.body;
  console.log(duration);
  try {
    deploy(parseInt(duration), brand, rn).then(async (result) => {
      res.send({ address: result });
    });
  } catch (err) {
    res.status(501).send("err");
  }
});

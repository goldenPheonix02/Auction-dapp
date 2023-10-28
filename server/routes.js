const express = require("express");
const router = express.Router();
const auctionLogic = require("../truffle/logic/logic");
module.exports = router;
const compile = require("../truffle/logic/compile");
const deploy = require("../truffle/logic/deploy");

router.get("/highest", auctionLogic.getHighest);
router.post("/bid", auctionLogic.bid);
router.post("/cancel", auctionLogic.cancelAuction);
router.get("/time", auctionLogic.getTime);
router.get("/accounts", auctionLogic.getAccounts);
router.get("/compile", async (req, res) => {
  const result = compile();
  res.send(result);
});
router.get("/deploy", async (req, res) => {
  const result = await deploy(200, "Jai", "11");
  res.send(result);
});

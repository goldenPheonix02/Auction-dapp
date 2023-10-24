const express = require("express");
const router = express.Router();
const auctionLogic = require("../truffle/logic/logic");
module.exports = router;

router.get("/highest", auctionLogic.getHighest);
router.post("/bid", auctionLogic.bid);
router.post("/cancel", auctionLogic.cancelAuction);
router.get("/time", auctionLogic.getTime);

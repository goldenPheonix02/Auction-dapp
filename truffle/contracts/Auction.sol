
pragma solidity ^0.8.13;

contract Auction {
    address internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum AuctionState {
        CANCELLED,
        STARTED
    }

    struct Car {
        string Brand;
        string Rnumber; 
    }
    Car public Mycar;
    address[] public bidders;

    mapping(address => uint256) public bids;

    AuctionState public STATE;

    modifier anOngoingAuction() {
        require(block.timestamp <= auction_end, "Auction has ended");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == auction_owner, "Only auction owner can call this function");
        _;
    }

    function bid() public virtual  payable returns (bool){}
    function withdraw() public virtual returns (bool){}
    function cancel_auction() virtual external returns (bool){}

    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}

contract MyAuction is Auction {
    constructor(uint256 _biddingTime, address _owner, string memory _brand, string memory _Rnumber) {
        auction_owner = _owner;
        auction_start = block.timestamp;
        auction_end = auction_start + _biddingTime * 1 minutes;
        STATE = AuctionState.STARTED;
        Mycar.Brand = _brand;
        Mycar.Rnumber = _Rnumber;
    }

    function bid() public override payable anOngoingAuction returns (bool) {
        require(bids[msg.sender] + msg.value > highestBid, "You can't bid, Make a higher Bid");
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        bids[msg.sender] += msg.value;
        emit BidEvent(highestBidder, highestBid);
        return true;
    }

    function cancelAuction() external onlyOwner anOngoingAuction returns (bool) {
        STATE = AuctionState.CANCELLED;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
    }

    function destructAuction() external onlyOwner returns (bool) {
        require(block.timestamp > auction_end, "You can't destruct the contract, The auction is still open");
        
        for (uint256 i = 0; i < bidders.length; i++) {
            require(bids[bidders[i]] == 0, "Bidders still have remaining funds");
        }

        payable(auction_owner).transfer(address(this).balance);
        
        return true;
    }

    function withdraw() override  public returns (bool) {
        require(block.timestamp > auction_end, "You can't withdraw, the auction is still open");
        uint256 amount = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function getOwner() public view returns (address) {
        return auction_owner;
    }
}

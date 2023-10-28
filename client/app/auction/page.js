"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";

const toaster = (mssg, type) => {
  console.log(mssg);
  toast[type](mssg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export default () => {
  const [accounts, setaccounts] = useState([]);
  const [account, setaccount] = useState();
  const [time, settime] = useState({ t1: 0, t2: 0 });
  const [value, setvalue] = useState(0);
  const [high, sethigh] = useState({ h1: "-", h2: "-", owner: "-" });
  const getHighest = async () => {
    axios.get("http://localhost:4000/api/highest").then((data) =>
      sethigh({
        h1: data?.data?.highestBid,
        h2: data?.data?.highestBidder,
        owner: data?.data?.owner,
      })
    );
  };
  useEffect(() => {
    axios.get("http://localhost:4000/api/accounts").then((data) => {
      // setaccount[]
      setaccounts(data?.data?.accounts);
    });
    axios.get("http://localhost:4000/api/time").then(({ data }) => {
      settime({ t1: data.startTime, t2: data.endTime });
    });
    getHighest();
  }, []);

  useEffect(() => {
    setaccount(accounts[0]);
  }, [accounts]);

  const bid = async () => {
    axios
      .post("http://localhost:4000/api/bid", {
        value: value,
        account: account,
      })
      .then((data) => {
        console.log(data.data);
        toaster(data?.data?.status, "success");
        getHighest();
      })
      .catch((err) => {
        console.log(1);
        var mssg = err?.response?.data?.err;
        mssg = mssg.split("revert")[1];
        toaster(mssg, "error");
      });
  };
  return (
    <div className="position-relative">
      <ToastContainer />
      <nav className="left-0 right-0 w-100 bg-blue-300 p-4 shadow-lg w-inherit">
        <div className="text-center text-3xl text-bold">Auction</div>
      </nav>
      <div className="mt-4 p-2 flex justify-center">
        <div className="flex-col gap-4">
          <div className="flex gap-7 justify-center mb-6">
            <div>
              <div className="text-xl font-bold text-center">Brand Name</div>
              <div className="text-center text-sm">Maruti</div>
            </div>
            <div>
              <div className="text-xl font-bold text-center">Rn Number</div>
              <div className="text-sm text-center">111</div>
            </div>
          </div>
          <div className="text-xl font-bold text-center">
            Current highest Bid
          </div>
          <div className="text-md mt-2 text-center">{high.h1}</div>
          <div className="text-xl font-bold text-center mt-4">
            Highest Bidder
          </div>
          <div className="text-md mt-2 text-center">{high.h2}</div>
          <div className="text-xl font-bold text-center mt-4">
            Auction Owner
          </div>
          <div className="text-md mt-2 text-center">{high.owner}</div>
          <hr className="border-1 m-4" />
          <div className="flex gap-2 justify-center mt-4 items-cener">
            <button
              className="px-6 py-2 text-white bg-red-400 rounded-lg"
              onClick={bid}
            >
              Bid
            </button>
            <input
              type="number"
              className="border-2 focus:outline-0 px-2"
              placeholder="Enter Value"
              value={value}
              onChange={(e) => {
                e.preventDefault();
                setvalue(e.target.value);
              }}
            />
            <div className="flex-col flex items-center ml-2">
              <div>
                <label for="cars" className="self-center text-sm font-bold">
                  Choose account
                </label>
              </div>
              <select
                id="cars"
                name="cars"
                className="text-center"
                onChange={(e) => {
                  e.preventDefault();
                  setaccount(e.target.value);
                }}
              >
                {accounts.map((e) => (
                  <option value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="">
            <button className="mx-auto px-6 w-full py-2 bg-red-400 mt-4 m-auto text-white rounded-lg">
              Cancel Auction
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex-col w-1/2">
              <button className="px-6 py-2 w-full bg-green-400 mt-4 m-auto text-white rounded-lg">
                Get Start Time
              </button>
              <div className="text-center mt-4">{time.t1}</div>
            </div>
            <div className="flex-col w-1/2">
              <button className="px-6 py-2 w-full bg-green-400 mt-4 m-auto text-white rounded-lg">
                Get End Time
              </button>
              <div className="text-center mt-4 break-normal">{time.t2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

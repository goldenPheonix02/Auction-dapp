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
  const [deployed, setdeployed] = useState(false);
  const [account, setaccount] = useState();
  const [time, settime] = useState({ t1: 0, t2: 0 });
  const [info, setinfo] = useState({ brand: "-", rnumber: "-" });
  const [value, setvalue] = useState(0);
  const [data, setdata] = useState({ brand: "Jai", rn: "1000", duration: 0 });
  const [high, sethigh] = useState({ h1: "-", h2: "-", owner: "-" });
  const getHighest = async () => {
    axios.get("http://localhost:4000/api/highest").then(({ data }) => {
      sethigh({
        h1: data?.highestBid,
        h2: data?.highestBidder,
        owner: data?.owner,
      });
      setinfo({
        brand: data?.Brand,
        rnumber: data?.Rnumber,
      });
    });
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/accounts")
      .then((data) => {
        // setaccount[]
        setaccounts(data?.data?.accounts);
      })
      .catch((data) => console.log(data));
  }, []);

  const defaults = async () => {
    axios.get("http://localhost:4000/api/time").then(({ data }) => {
      settime({ t1: data.startTime, t2: data.endTime });
    });
    getHighest();
  };

  useEffect(() => {
    setaccount(accounts[0]);
  }, [accounts]);

  const compile = async () => {
    axios.get("http://localhost:4000/api/compile").then(({ data }) => {
      toaster(data, "success");
    });
  };

  const deploy = async () => {
    axios.post("http://localhost:4000/api/deploy", data).then(({ data }) => {
      toaster("Successfully deployed", "success");
      // setTimeout(async () => {
      defaults();
      // }, 0);
    });
  };

  const cancel = async (flag) => {
    axios
      .post(`http://localhost:4000/api/${flag == 1 ? "cancel" : "destruct"}`, {
        account,
      })
      .then(({ data }) => {
        toaster("Successfully cancelled", "success");
      })
      .catch((err) => {
        var mssg = err?.response?.data?.err;
        mssg = mssg.split("revert")[1];
        toaster(mssg, "error");
      });
  };

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
  const handleChange = (e) => {
    e.preventDefault();
    setdata((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    console.log(data);
  };
  return (
    <div className="position-relative ">
      <ToastContainer />
      <nav className="left-0 right-0 w-100 bg-blue-300 p-4 shadow-lg w-inherit">
        <div className="text-center text-3xl text-bold font-serif">Auction</div>
      </nav>
      <div className="mt-4 p-2 flex justify-center">
        <div className="flex-col gap-4 w-1/2">
          <div className="flex gap-10 justify-between mb-6">
            <div>
              <div className="text-xl font-bold text-center">Brand Name</div>
              <div className="text-center text-sm">{info.brand}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-center">Rn Number</div>
              <div className="text-sm text-center">{info.rnumber}</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-center">
                Current highest Bid
              </div>
              <div className="text-md mt-2 text-center">{high.h1}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-right">Highest Bidder</div>
              <div className="text-md mt-2 text-center">{high.h2}</div>
            </div>
          </div>
          <div className="text-xl font-bold text-center mt-4">
            Auction Owner
          </div>
          <div className="text-md mt-2 text-center">{high.owner}</div>
          <hr className="border-1 m-4" />
          <div className="flex gap-4">
            <div className="flex-col w-1/2">
              <button
                onClick={compile}
                className="px-6 py-2 w-full bg-green-400 mt-4 m-auto text-white rounded-lg"
              >
                Compile Contract
              </button>
            </div>
            <div className="flex-col w-1/2">
              <button
                onClick={deploy}
                className="px-6 py-2 w-full bg-green-400 mt-4 m-auto text-white rounded-lg"
              >
                Deploy Contract
              </button>
              <div></div>
            </div>
          </div>
          {deployed ? (
            ""
          ) : (
            <div className=" flex gap-3 py-3 justify-center">
              <input
                type="number"
                className="border-2 focus:outline-0 px-2 w-52"
                placeholder="Enter Duration"
                value={data.duration}
                name="duration"
                onChange={handleChange}
              />
              <input
                className="border-2 focus:outline-0 px-2 w-52"
                placeholder="Enter Brand Name"
                value={data.brand}
                name="brand"
                onChange={handleChange}
              />
              <input
                name="rn"
                type="number"
                className="border-2 focus:outline-0 px-2 w-52"
                placeholder="Enter Rnumber"
                value={data.rn}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="flex gap-2 justify-center mt-4 items-center">
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
          <div className="flex gap-4">
            <button
              onClick={() => cancel(1)}
              className="mx-auto px-6 w-full py-2 bg-red-400 mt-4 m-auto text-white rounded-lg"
            >
              Cancel Auction
            </button>
            <button
              onClick={() => cancel(0)}
              className="mx-auto px-6 w-full py-2 bg-red-400 mt-4 m-auto text-white rounded-lg"
            >
              Destruct Auction
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

"use client";

import React, { useState, useEffect } from "react";
import Calculate from "@/components/calculate";
import Yerrp from "@/components/yerrp";

const STORAGE_KEY = "portfolio-balancer-state";

const PortfolioBalancer = () => {
  const [totalInvestment, setTotalInvestment] = useState(1000);
  const [coins, setCoins] = useState([{ id: 1, name: "", percentage: 0 }]);
  const [nextId, setNextId] = useState(2);
  const [saveStatus, setSaveStatus] = useState("");

  // Load saved state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const {
        totalInvestment: savedInvestment,
        coins: savedCoins,
        nextId: savedNextId,
      } = JSON.parse(savedState);
      setTotalInvestment(savedInvestment);
      setCoins(savedCoins);
      setNextId(savedNextId);
    }
  }, []);

  const handleSave = () => {
    try {
      const stateToSave = {
        totalInvestment,
        coins,
        nextId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 2000); // Clear message after 2 seconds
    } catch (error) {
      console.log("Error: " + error);
      setSaveStatus("Error saving portfolio");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const getRemainingPercentage = () => {
    const total = coins.reduce((sum, coin) => sum + (coin.percentage || 0), 0);
    return Math.max(0, 100 - total);
  };

  const handleAddCoin = () => {
    setCoins((prevCoins) => [
      ...prevCoins,
      {
        id: nextId,
        name: "",
        percentage: 0,
      },
    ]);
    setNextId((prevId) => prevId + 1);
  };

  const handleRemoveCoin = (id: number) => {
    if (coins.length > 1) {
      setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== id));
    }
  };

  const handleCoinChange = (id: number, field: string, value: string) => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) => {
        if (coin.id === id) {
          if (field === "percentage") {
            const numValue = Math.min(Math.max(0, parseFloat(value) || 0), 100);
            return { ...coin, percentage: numValue };
          }
          return { ...coin, [field]: value };
        }
        return coin;
      })
    );
  };

  const calculateDollarAmount = (percentage: number) => {
    return ((percentage / 100) * totalInvestment).toFixed(2);
  };

  const totalPercentage = coins.reduce(
    (sum, coin) => sum + (coin.percentage || 0),
    0
  );
  const isValid = totalPercentage === 100;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">
              Portfolio Percentage Allocator
            </h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors duration-200"
            >
              Save Portfolio
            </button>
          </div>

          {saveStatus && (
            <div
              className={`mb-4 p-2 rounded-md text-center ${
                saveStatus.includes("Error")
                  ? "bg-red-900/50 text-red-300 border border-red-800"
                  : "bg-green-900/50 text-green-300 border border-green-800"
              }`}
            >
              {saveStatus}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Total Investment ($)
            </label>
            <input
              type="number"
              value={totalInvestment}
              onChange={(e) =>
                setTotalInvestment(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            {coins.map((coin) => (
              <div key={coin.id} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Coin name"
                  value={coin.name}
                  onChange={(e) =>
                    handleCoinChange(coin.id, "name", e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="w-32 relative">
                  <input
                    type="number"
                    value={coin.percentage}
                    onChange={(e) =>
                      handleCoinChange(coin.id, "percentage", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">
                    %
                  </span>
                </div>
                <div className="w-32 text-right text-gray-300">
                  ${calculateDollarAmount(coin.percentage)}
                </div>
                {coins.length > 1 && (
                  <button
                    onClick={() => handleRemoveCoin(coin.id)}
                    className="p-2 text-red-400 hover:text-red-300 rounded-md transition-colors duration-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleAddCoin}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-200 flex items-center gap-2"
            >
              <span>+</span> Add Coin
            </button>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-300">
                Remaining: {getRemainingPercentage()}%
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="mt-4 p-4 bg-red-900/50 text-red-300 rounded-md border border-red-800">
              Total allocation must equal 100% (currently at {totalPercentage}%)
            </div>
          )}

          {isValid && (
            <div className="mt-4 p-4 bg-green-900/50 text-green-300 rounded-md border border-green-800">
              Portfolio successfully balanced!
            </div>
          )}
        </div>
      </div>
      <Calculate />
      <Yerrp />
    </div>
  );
};

export default PortfolioBalancer;

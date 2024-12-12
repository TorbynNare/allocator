"use client";

import React, { useState, useMemo } from "react";

const PortfolioBalancerWithMultiplier = () => {
  const [totalInvestment, setTotalInvestment] = useState(1000);
  const [coins, setCoins] = useState([
    { id: 1, name: "", percentage: 0, multiplier: 1 },
  ]);
  const [nextId, setNextId] = useState(2);
  const [saveStatus, setSaveStatus] = useState("");

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
        multiplier: 1,
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
          if (field === "multiplier") {
            const numValue = Math.max(1, parseFloat(value) || 1);
            return { ...coin, multiplier: numValue };
          }
          return { ...coin, [field]: value };
        }
        return coin;
      })
    );
  };

  const calculateDollarAmount = (percentage: number, multiplier: number) => {
    const initialAmount = (percentage / 100) * totalInvestment;
    const projectedAmount = initialAmount * multiplier;
    return {
      initial: initialAmount.toFixed(2),
      projected: projectedAmount.toFixed(2),
    };
  };

  const portfolioSummary = useMemo(() => {
    const initialTotal = coins.reduce((sum, coin) => {
      return (
        sum +
        parseFloat(
          calculateDollarAmount(coin.percentage, coin.multiplier).initial
        )
      );
    }, 0);

    const projectedTotal = coins.reduce((sum, coin) => {
      return (
        sum +
        parseFloat(
          calculateDollarAmount(coin.percentage, coin.multiplier).projected
        )
      );
    }, 0);

    return {
      initialTotal: initialTotal.toFixed(2),
      projectedTotal: projectedTotal.toFixed(2),
      totalGrowth: ((projectedTotal / initialTotal - 1) * 100).toFixed(2),
    };
  }, [coins, totalInvestment]);

  const totalPercentage = coins.reduce(
    (sum, coin) => sum + (coin.percentage || 0),
    0
  );
  const isValid = totalPercentage === 100;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Portfolio Percentage Allocator with Value Projection
        </h2>

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
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>
              <div className="w-32 relative">
                <input
                  type="number"
                  value={coin.multiplier}
                  onChange={(e) =>
                    handleCoinChange(coin.id, "multiplier", e.target.value)
                  }
                  step="0.1"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-400">x</span>
              </div>
              <div className="w-48 text-right text-gray-300 flex flex-col">
                <div>
                  <span className="text-sm text-gray-500">Initial: </span>$
                  {calculateDollarAmount(
                    coin.percentage,
                    coin.multiplier
                  ).initial.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div>
                  <span className="text-sm text-gray-500">Projected: </span>$
                  {calculateDollarAmount(
                    coin.percentage,
                    coin.multiplier
                  ).projected.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
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

        {isValid && (
          <div className="mt-4 p-4 bg-gray-700 rounded-md border border-gray-600">
            <div className="text-lg font-semibold mb-2">Portfolio Summary</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400">Initial Total:</span>
                <div className="text-gray-100">
                  $
                  {portfolioSummary.initialTotal.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Projected Total:</span>
                <div className="text-gray-100">
                  $
                  {portfolioSummary.projectedTotal.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Total Growth:</span>
                <div
                  className={`
                  ${
                    parseFloat(portfolioSummary.totalGrowth) > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                `}
                >
                  {portfolioSummary.totalGrowth}%
                </div>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default PortfolioBalancerWithMultiplier;

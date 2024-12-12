import React, { useState, useEffect } from "react";

const PercentageToMultiplier = () => {
  const [percentage, setPercentage] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [summary, setSummary] = useState("");

  // Utility function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage from multiplier
  const calculatePercentage = (inputMultiplier: string) => {
    const numMultiplier = parseInt(inputMultiplier);

    if (isNaN(numMultiplier) || numMultiplier <= 0) {
      return "";
    }

    // Subtract 1 and multiply by 100 to get percentage
    return ((numMultiplier - 1) * 100).toFixed(0);
  };

  // Calculate multiplier from percentage
  const calculateMultiplier = (inputPercentage: string) => {
    const numPercentage = parseInt(inputPercentage);

    if (isNaN(numPercentage)) {
      return "";
    }

    // Add 1 to convert percentage to multiplier
    return (numPercentage / 100 + 1).toFixed(0);
  };

  // Handle percentage input changes
  const handlePercentageChange = (e: any) => {
    const inputValue = e.target.value;
    setPercentage(inputValue);
    setMultiplier(calculateMultiplier(inputValue));
  };

  // Handle multiplier input changes
  const handleMultiplierChange = (e: any) => {
    const inputValue = e.target.value;
    setMultiplier(inputValue);
    setPercentage(calculatePercentage(inputValue));
  };

  // Update summary based on inputs
  useEffect(() => {
    if (multiplier && percentage) {
      const percentNum = parseInt(percentage);
      const multNum = parseInt(multiplier);

      let summaryText = "";
      if (multNum > 1) {
        summaryText = `A ${formatNumber(
          Number(percentage)
        )}% increase or a ${multiplier}x means for every $1 invested, you would have $${multiplier}`;
      } else if (multNum < 1) {
        summaryText = `A ${formatNumber(
          Number(percentage)
        )}% decrease or a ${multiplier}x means for every $1 invested, you would have $${multiplier}`;
      } else {
        summaryText = "No change in value";
      }

      setSummary(summaryText);
    } else {
      setSummary("");
    }
  }, [percentage, multiplier]);

  return (
    <div className="bg-gray-900 text-gray-100 py-8">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Percentage and Multiplier Converter
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Percentage Change
            </label>
            <input
              type="number"
              value={percentage}
              onChange={handlePercentageChange}
              placeholder="Enter percentage change"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Value Multiplier
            </label>
            <input
              type="number"
              value={multiplier}
              onChange={handleMultiplierChange}
              placeholder="Enter value multiplier"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {summary && (
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600 mt-4">
              <div className="text-lg font-semibold">
                <span className="text-gray-300">Summary:</span>{" "}
                <span className="text-blue-400">{summary}</span>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400 mt-4">
            <h3 className="font-semibold mb-2">Quick Reference:</h3>
            <ul className="list-disc list-inside">
              <li>0% = 1x (no change)</li>
              <li>100% = 2x (doubled)</li>
              <li>200% = 3x (tripled)</li>
              <li>-50% = 0.5x (halved)</li>
              <li>Percentage and multiplier are inversely related</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageToMultiplier;
import React, { useState } from "react";
import { formatCurrency } from "../../../utils/helpers";

const BudgetSection = ({ monthlyBudget, onUpdateBudget }) => {
  const [budgetInput, setBudgetInput] = useState("");
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const handleBudgetUpdate = async () => {
    const newBudget = parseFloat(budgetInput);
    if (isNaN(newBudget) || newBudget < 0) {
      return;
    }

    try {
      await onUpdateBudget(newBudget);
      setIsEditingBudget(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="budget-section">
      <h3>Monthly Budget</h3>
      {!isEditingBudget ? (
        <div className="budget-display">
          <span className="budget-amount">{formatCurrency(monthlyBudget)}</span>
          <button
            onClick={() => {
              setBudgetInput(monthlyBudget);
              setIsEditingBudget(true);
            }}
            className="edit-btn"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="budget-edit">
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            placeholder="Enter monthly budget"
            min="0"
          />
          <button onClick={handleBudgetUpdate} className="save-btn">
            Save
          </button>
          <button
            onClick={() => setIsEditingBudget(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetSection;

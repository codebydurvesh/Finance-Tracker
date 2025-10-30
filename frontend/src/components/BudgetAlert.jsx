import React, { useState } from "react";
import { formatCurrency } from "../utils/helpers";
import "./BudgetAlert.css";

const BudgetAlert = ({ totalIncome, totalExpense, monthlyBudget }) => {
  const [dismissed, setDismissed] = useState(false);

  const moneyRemaining = totalIncome - totalExpense;
  const percentageSpent = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  // Determine alert type
  const getAlertType = () => {
    if (totalExpense > totalIncome) {
      return "danger"; // Overspent - expenses exceed total income
    } else if (percentageSpent >= 90) {
      return "warning"; // Warning - spent 90% or more
    } else if (percentageSpent >= 75) {
      return "info"; // Info - spent 75% or more
    }
    return null;
  };

  const alertType = getAlertType();

  // Don't show if no alert or dismissed
  if (!alertType || dismissed) {
    return null;
  }

  const getAlertMessage = () => {
    switch (alertType) {
      case "danger":
        return {
          icon: "🚨",
          title: "Budget Exceeded!",
          message: `You've overspent by ${formatCurrency(Math.abs(moneyRemaining))}. Your expenses (${formatCurrency(totalExpense)}) exceed your total income (${formatCurrency(totalIncome)}).`,
        };
      case "warning":
        return {
          icon: "⚠️",
          title: "Budget Alert!",
          message: `You've spent ${percentageSpent.toFixed(1)}% of your budget. Only ${formatCurrency(moneyRemaining)} remaining out of ${formatCurrency(totalIncome)}.`,
        };
      case "info":
        return {
          icon: "ℹ️",
          title: "Budget Notice",
          message: `You've spent ${percentageSpent.toFixed(1)}% of your budget. ${formatCurrency(moneyRemaining)} remaining.`,
        };
      default:
        return null;
    }
  };

  const alertContent = getAlertMessage();

  return (
    <div className={`budget-alert ${alertType}`}>
      <div className="alert-content">
        <span className="alert-icon">{alertContent.icon}</span>
        <div className="alert-text">
          <h4 className="alert-title">{alertContent.title}</h4>
          <p className="alert-message">{alertContent.message}</p>
        </div>
      </div>
      <button
        className="alert-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
      >
        ✕
      </button>
    </div>
  );
};

export default BudgetAlert;

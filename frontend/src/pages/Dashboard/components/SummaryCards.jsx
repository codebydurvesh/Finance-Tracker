import React from "react";
import { formatCurrency } from "../../../utils/helpers";

const SummaryCards = ({ summary, monthlyBudget }) => {
  const totalIncome = summary.totalIncome + monthlyBudget;
  const { totalExpense } = summary;
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="summary-section">
      <div className="summary-card income">
        <h3>Total Income</h3>
        <p className="amount">{formatCurrency(totalIncome)}</p>
      </div>
      <div
        className={`summary-card expense ${
          totalExpense > totalIncome
            ? "danger"
            : totalExpense >= totalIncome * 0.9
            ? "warning"
            : ""
        }`}
      >
        <h3>Total Expense</h3>
        <p className="amount">{formatCurrency(totalExpense)}</p>
      </div>
      <div className={`summary-card balance ${netBalance < 0 ? "danger" : ""}`}>
        <h3>Net Balance</h3>
        <p className="amount">{formatCurrency(netBalance)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;

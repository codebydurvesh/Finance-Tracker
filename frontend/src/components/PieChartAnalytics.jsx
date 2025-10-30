import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../utils/helpers";
import "./PieChartAnalytics.css";

const PieChartAnalytics = ({ transactions, monthlyBudget = 0 }) => {
  // Colors for the pie chart
  const COLORS = {
    expense: "#f97316", // Orange for spent money
    remaining: "#10b981", // Green for remaining money
  };

  // Calculate total income and expenses
  const chartData = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    // Start with monthly budget as base income, then add income transactions
    totalIncome += monthlyBudget;

    // Calculate money remaining
    const moneyRemaining = Math.max(0, totalIncome - totalExpense);

    // Cap expenses at total income (can't spend more than 100% in the pie)
    const displayExpense = Math.min(totalExpense, totalIncome);

    console.log("Pie Chart Calculation:", {
      monthlyBudget,
      incomeFromTransactions: totalIncome - monthlyBudget,
      totalIncome,
      totalExpense,
      moneyRemaining,
      displayExpense,
    });

    // Pie chart shows: Expenses (spent) vs Remaining (left from 100% income)
    return [
      { name: "Spent", value: displayExpense, type: "expense" },
      { name: "Remaining", value: moneyRemaining, type: "remaining" },
    ];
  }, [transactions, monthlyBudget]);

  // Calculate totals for display
  const totalExpense = chartData[0].value; // Spent amount
  const moneyRemaining = chartData[1].value; // Remaining amount
  const totalIncome = totalExpense + moneyRemaining; // Total income (100%)

  // Custom label renderer
  const renderLabel = (entry) => {
    if (totalIncome === 0) return "0%";
    const percent = ((entry.value / totalIncome) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percent =
        totalIncome === 0 ? 0 : ((value / totalIncome) * 100).toFixed(1);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">{formatCurrency(value)}</p>
          <p className="tooltip-percent">{percent}%</p>
        </div>
      );
    }
    return null;
  };

  // Don't show chart if total income is 0
  if (totalIncome === 0) {
    return (
      <div className="pie-chart-container">
        <h2>Budget Overview</h2>
        <p className="no-data">
          Set a monthly budget to see your spending overview.
        </p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <h2>Budget Overview - How Much Have You Spent?</h2>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) =>
                `${value}: ${formatCurrency(entry.payload.value)}`
              }
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="chart-summary">
          <div className="summary-item income-item">
            <div className="summary-label">
              <span
                className="summary-color"
                style={{ backgroundColor: "#3b82f6" }}
              ></span>
              <span>Total Income (100%)</span>
            </div>
            <span className="summary-value income-value">
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="summary-item expense-item">
            <div className="summary-label">
              <span
                className="summary-color"
                style={{ backgroundColor: COLORS.expense }}
              ></span>
              <span>
                Spent (
                {totalIncome > 0
                  ? ((totalExpense / totalIncome) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <span className="summary-value expense-value">
              {formatCurrency(totalExpense)}
            </span>
          </div>

          <div className="summary-item balance-item">
            <div className="summary-label">
              <span
                className="summary-color"
                style={{ backgroundColor: COLORS.remaining }}
              ></span>
              <span>
                Remaining (
                {totalIncome > 0
                  ? ((moneyRemaining / totalIncome) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <span
              className={`summary-value ${
                moneyRemaining >= 0 ? "positive" : "negative"
              }`}
            >
              {formatCurrency(moneyRemaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartAnalytics;

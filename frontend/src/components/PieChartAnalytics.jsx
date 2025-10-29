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
  // Colors for income and expense
  const COLORS = {
    income: "#3b82f6", // Blue
    expense: "#f97316", // Orange
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

    console.log("Pie Chart Calculation:", {
      monthlyBudget,
      incomeFromTransactions: totalIncome - monthlyBudget,
      totalIncome,
      totalExpense,
      moneyRemaining: totalIncome - totalExpense,
    });

    return [
      { name: "Income", value: totalIncome, type: "income" },
      { name: "Expenses", value: totalExpense, type: "expense" },
    ];
  }, [transactions, monthlyBudget]);

  // Calculate totals
  const totalIncome = chartData[0].value;
  const totalExpense = chartData[1].value;
  const total = totalIncome + totalExpense;

  // Custom label renderer
  const renderLabel = (entry) => {
    if (total === 0) return "0%";
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percent = total === 0 ? 0 : ((value / total) * 100).toFixed(1);
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

  // Don't show chart if both income and expenses are 0
  if (total === 0) {
    return (
      <div className="pie-chart-container">
        <h2>Income vs Expenses</h2>
        <p className="no-data">
          No transactions to display. Add some transactions to see the chart.
        </p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <h2>Income vs Expenses Overview</h2>

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
                style={{ backgroundColor: COLORS.income }}
              ></span>
              <span>Total Income</span>
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
              <span>Total Expenses</span>
            </div>
            <span className="summary-value expense-value">
              {formatCurrency(totalExpense)}
            </span>
          </div>

          <div className="summary-item balance-item">
            <div className="summary-label">
              <span className="summary-icon">💰</span>
              <span>Money Remaining</span>
            </div>
            <span
              className={`summary-value ${
                totalIncome - totalExpense >= 0 ? "positive" : "negative"
              }`}
            >
              {formatCurrency(totalIncome - totalExpense)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartAnalytics;

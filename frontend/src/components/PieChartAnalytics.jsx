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
    overspent: "#dc2626", // Red for overspending
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

    // Calculate money remaining or overspent amount
    const difference = totalIncome - totalExpense;
    const moneyRemaining = Math.max(0, difference);
    const overspentAmount = Math.abs(Math.min(0, difference));

    // If overspent, show expenses within budget + overspent amount
    if (totalExpense > totalIncome) {
      console.log("Pie Chart Calculation (OVERSPENT):", {
        monthlyBudget,
        incomeFromTransactions: totalIncome - monthlyBudget,
        totalIncome,
        totalExpense,
        expenseWithinBudget: totalIncome,
        overspentAmount,
      });

      return [
        { name: "Spent (Within Budget)", value: totalIncome, type: "expense" },
        { name: "Overspent", value: overspentAmount, type: "overspent" },
      ];
    } else {
      // Normal case: show spent vs remaining
      console.log("Pie Chart Calculation:", {
        monthlyBudget,
        incomeFromTransactions: totalIncome - monthlyBudget,
        totalIncome,
        totalExpense,
        moneyRemaining,
      });

      return [
        { name: "Spent", value: totalExpense, type: "expense" },
        { name: "Remaining", value: moneyRemaining, type: "remaining" },
      ];
    }
  }, [transactions, monthlyBudget]);

  // Calculate totals for display
  const isOverspent =
    chartData.length === 2 && chartData[1].type === "overspent";
  const totalIncome = isOverspent
    ? chartData[0].value // In overspent case, first slice is the total budget
    : chartData[0].value + chartData[1].value; // Normal case: spent + remaining
  const totalExpense = isOverspent
    ? chartData[0].value + chartData[1].value // spent within budget + overspent
    : chartData[0].value; // normal spent amount
  const moneyRemaining = isOverspent ? 0 : chartData[1].value;
  const overspentAmount = isOverspent ? chartData[1].value : 0;

  // Custom label renderer
  const renderLabel = (entry) => {
    if (totalIncome === 0) return "0%";
    // For overspent scenarios, calculate percentage of total expense
    const base = isOverspent ? totalExpense : totalIncome;
    const percent = ((entry.value / base) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const base = isOverspent ? totalExpense : totalIncome;
      const percent = base === 0 ? 0 : ((value / base) * 100).toFixed(1);
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
                  ? (
                      (Math.min(totalExpense, totalIncome) / totalIncome) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <span className="summary-value expense-value">
              {formatCurrency(totalExpense)}
            </span>
          </div>

          {isOverspent ? (
            <div className="summary-item overspent-item">
              <div className="summary-label">
                <span
                  className="summary-color"
                  style={{ backgroundColor: COLORS.overspent }}
                ></span>
                <span>
                  Overspent (
                  {totalIncome > 0
                    ? ((overspentAmount / totalExpense) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <span className="summary-value overspent-value">
                {formatCurrency(overspentAmount)}
              </span>
            </div>
          ) : (
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
              <span className="summary-value positive">
                {formatCurrency(moneyRemaining)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieChartAnalytics;

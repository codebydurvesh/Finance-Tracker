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

const PieChartAnalytics = ({ transactions }) => {
  // Colors for different categories
  const COLORS = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#fee140",
    "#30cfd0",
    "#a8edea",
    "#fed6e3",
    "#c471f5",
    "#12c2e9",
    "#f64f59",
    "#c471ed",
    "#ffa751",
    "#ffe259",
  ];

  // Calculate category-wise data for income
  const incomeData = useMemo(() => {
    const categoryMap = {};

    transactions
      .filter((t) => t.type === "income")
      .forEach((transaction) => {
        const category = transaction.category || "Other";
        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }
        categoryMap[category] += transaction.amount;
      });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Calculate category-wise data for expenses
  const expenseData = useMemo(() => {
    const categoryMap = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        const category = transaction.category || "Other";
        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }
        categoryMap[category] += transaction.amount;
      });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Custom label renderer
  const renderLabel = (entry) => {
    const percent = ((entry.percent || 0) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
          <p className="tooltip-percent">
            {((payload[0].percent || 0) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="pie-chart-container">
        <h2>Analytics</h2>
        <p className="no-data">
          No transactions to display. Add some transactions to see the
          analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <h2>Category-wise Analytics</h2>

      <div className="charts-grid">
        {/* Income Chart */}
        <div className="chart-section">
          <h3 className="chart-title income-title">Income by Category</h3>
          {incomeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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

              {/* Income Categories List */}
              <div className="categories-list">
                {incomeData.map((item, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <span
                        className="category-color"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span className="category-name">{item.name}</span>
                    </div>
                    <span className="category-value income-value">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-data-chart">No income transactions yet</p>
          )}
        </div>

        {/* Expense Chart */}
        <div className="chart-section">
          <h3 className="chart-title expense-title">Expenses by Category</h3>
          {expenseData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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

              {/* Expense Categories List */}
              <div className="categories-list">
                {expenseData.map((item, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <span
                        className="category-color"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span className="category-name">{item.name}</span>
                    </div>
                    <span className="category-value expense-value">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-data-chart">No expense transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieChartAnalytics;

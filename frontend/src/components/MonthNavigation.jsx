import React from "react";
import "./MonthNavigation.css";

const MonthNavigation = ({ year, month, onPrevMonth, onNextMonth }) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Check if we're viewing the current month
  const isCurrentMonth = year === currentYear && month === currentMonth;

  // Disable next button if viewing current month
  const canGoNext = !isCurrentMonth;

  return (
    <div className="month-navigation">
      <button
        className="nav-btn prev-btn"
        onClick={onPrevMonth}
        aria-label="Previous month"
      >
        ← Previous
      </button>
      <div className="month-display">
        <h3>
          {monthNames[month - 1]} {year}
        </h3>
        {isCurrentMonth && <span className="current-badge">Current Month</span>}
      </div>
      <button
        className="nav-btn next-btn"
        onClick={onNextMonth}
        disabled={!canGoNext}
        aria-label="Next month"
      >
        Next →
      </button>
    </div>
  );
};

export default MonthNavigation;

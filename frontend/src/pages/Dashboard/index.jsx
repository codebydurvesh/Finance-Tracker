import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import {
  getTransactionsByMonth,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionService";
import { updateBudget, getUserProfile } from "../../services/userService";
import TransactionsList from "../../components/TransactionsList";
import PieChartAnalytics from "../../components/PieChartAnalytics";
import BudgetAlert from "../../components/BudgetAlert";
import MonthNavigation from "../../components/MonthNavigation";
import DashboardHeader from "./components/DashboardHeader";
import BudgetSection from "./components/BudgetSection";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionsPreview from "./components/TransactionsPreview";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const pieChartRef = useRef(null);
  const alertRef = useRef(null);

  // State management
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);

  // Month selection state (default to current month)
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [transactionsData, userProfile] = await Promise.all([
        getTransactionsByMonth(selectedYear, selectedMonth),
        getUserProfile(),
      ]);

      const sortedTransactions = transactionsData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setTransactions(sortedTransactions);

      const monthSummary = sortedTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
            acc.netBalance += transaction.amount;
          } else {
            acc.totalExpense += transaction.amount;
            acc.netBalance -= transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, netBalance: 0 }
      );

      setSummary(monthSummary);

      if (userProfile && userProfile.monthlyBudget !== undefined) {
        setMonthlyBudget(userProfile.monthlyBudget);
        updateUser(userProfile);
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return;
    }

    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleBudgetUpdate = async (newBudget) => {
    try {
      const updatedUser = await updateBudget(Number(newBudget));
      setMonthlyBudget(updatedUser.monthlyBudget);
      updateUser(updatedUser);
      toast.success("Budget updated successfully!");
    } catch (err) {
      toast.error("Failed to update budget");
      throw err;
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    if (
      !transactionData.title ||
      !transactionData.amount ||
      !transactionData.day ||
      !transactionData.category
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const amount = Number(transactionData.amount);
    const day = Number(transactionData.day);

    if (isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
      toast.error("Please enter a valid whole number for amount");
      return false;
    }

    if (amount > 1000000000) {
      toast.error("Amount is too large");
      return false;
    }

    if (transactionData.title.trim().length < 2) {
      toast.error("Title must be at least 2 characters long");
      return false;
    }

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      toast.error(`Invalid day for selected month`);
      return false;
    }

    const paddedMonth = String(selectedMonth).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateString = `${selectedYear}-${paddedMonth}-${paddedDay}`;

    setLoading(true);

    try {
      const newTransaction = await createTransaction({
        title: transactionData.title,
        amount: amount,
        type: transactionData.type,
        category: transactionData.category,
        date: dateString,
      });

      const transactionDate = new Date(newTransaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      if (
        transactionYear === selectedYear &&
        transactionMonth === selectedMonth
      ) {
        setTransactions([newTransaction, ...transactions]);

        if (transactionData.type === "income") {
          setSummary({
            ...summary,
            totalIncome: summary.totalIncome + newTransaction.amount,
            netBalance: summary.netBalance + newTransaction.amount,
          });
        } else {
          setSummary({
            ...summary,
            totalExpense: summary.totalExpense + newTransaction.amount,
            netBalance: summary.netBalance - newTransaction.amount,
          });
        }

        setTimeout(() => {
          const updatedTotalIncome =
            summary.totalIncome +
            monthlyBudget +
            (transactionData.type === "income" ? newTransaction.amount : 0);
          const updatedTotalExpense =
            summary.totalExpense +
            (transactionData.type === "expense" ? newTransaction.amount : 0);
          const isBudgetExceeded = updatedTotalExpense > updatedTotalIncome;

          if (isBudgetExceeded) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (pieChartRef.current) {
            pieChartRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }

      toast.success("Transaction added successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const updatedTransaction = await updateTransaction(id, updatedData);

      const transactionDate = new Date(updatedTransaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      if (
        transactionYear === selectedYear &&
        transactionMonth === selectedMonth
      ) {
        const updatedList = transactions.map((t) =>
          t._id === id ? updatedTransaction : t
        );
        const sortedList = updatedList.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setTransactions(sortedList);

        const monthSummary = sortedList.reduce(
          (acc, transaction) => {
            if (transaction.type === "income") {
              acc.totalIncome += transaction.amount;
              acc.netBalance += transaction.amount;
            } else {
              acc.totalExpense += transaction.amount;
              acc.netBalance -= transaction.amount;
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0, netBalance: 0 }
        );
        setSummary(monthSummary);
      } else {
        const filteredList = transactions.filter((t) => t._id !== id);
        setTransactions(filteredList);

        const monthSummary = filteredList.reduce(
          (acc, transaction) => {
            if (transaction.type === "income") {
              acc.totalIncome += transaction.amount;
              acc.netBalance += transaction.amount;
            } else {
              acc.totalExpense += transaction.amount;
              acc.netBalance -= transaction.amount;
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0, netBalance: 0 }
        );
        setSummary(monthSummary);
      }

      toast.success("Transaction updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update transaction"
      );
      throw err;
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);

      const filteredList = transactions.filter((t) => t._id !== id);
      setTransactions(filteredList);

      const monthSummary = filteredList.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
            acc.netBalance += transaction.amount;
          } else {
            acc.totalExpense += transaction.amount;
            acc.netBalance -= transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, netBalance: 0 }
      );
      setSummary(monthSummary);

      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete transaction"
      );
      throw err;
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader userName={user?.name} onLogout={handleLogout} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {dataLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        <>
          <BudgetSection
            monthlyBudget={monthlyBudget}
            onUpdateBudget={handleBudgetUpdate}
          />

          <MonthNavigation
            year={selectedYear}
            month={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <div ref={alertRef}>
            <BudgetAlert
              totalIncome={summary.totalIncome + monthlyBudget}
              totalExpense={summary.totalExpense}
              monthlyBudget={monthlyBudget}
            />
          </div>

          <SummaryCards summary={summary} monthlyBudget={monthlyBudget} />

          <TransactionForm
            onSubmit={handleTransactionSubmit}
            loading={loading}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />

          {selectedYear === currentDate.getFullYear() &&
            selectedMonth === currentDate.getMonth() + 1 && (
              <TransactionsPreview transactions={transactions} />
            )}

          <div ref={pieChartRef}>
            <PieChartAnalytics
              transactions={transactions}
              monthlyBudget={monthlyBudget}
            />
          </div>

          <TransactionsList
            transactions={transactions}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;

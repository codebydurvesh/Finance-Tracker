import React from "react";
import { formatCurrency } from "../../../utils/helpers";

const TransactionsPreview = ({ transactions }) => {
  return (
    <div className="transactions-preview">
      <h3>Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="no-data">
          No transactions yet. Add your first transaction above!
        </p>
      ) : (
        <div className="transactions-list">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-title">{transaction.title}</span>
                <span className="transaction-category">
                  {transaction.category}
                </span>
              </div>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPreview;

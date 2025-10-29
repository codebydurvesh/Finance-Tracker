import api from "./api";

// Get all transactions
export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// Get transactions by month
export const getTransactionsByMonth = async (year, month) => {
  const response = await api.get(`/transactions/month/${year}/${month}`);
  return response.data;
};

// Get transaction summary
export const getTransactionSummary = async () => {
  const response = await api.get("/transactions/summary");
  return response.data;
};

// Get single transaction
export const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// Create transaction
export const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

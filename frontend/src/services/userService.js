import api from "./api";

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put("/users/me", userData);
  return response.data;
};

// Update monthly budget
export const updateBudget = async (monthlyBudget) => {
  const response = await api.put("/users/budget", { monthlyBudget });
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put("/users/password", passwordData);
  return response.data;
};

// Change email (with password confirmation)
export const changeEmail = async (newEmail, password) => {
  const response = await api.put("/users/change-email", {
    newEmail,
    password,
  });
  return response.data;
};

// Delete account (with password confirmation)
export const deleteAccount = async (password) => {
  const response = await api.delete("/users/delete-account", {
    data: { password },
  });
  return response.data;
};

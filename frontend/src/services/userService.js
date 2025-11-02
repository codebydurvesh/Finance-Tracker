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

// Send OTP for email change
export const sendEmailChangeOTP = async (newEmail) => {
  const response = await api.post("/users/change-email/send-otp", { newEmail });
  return response.data;
};

// Verify OTP and update email
export const verifyEmailChangeOTP = async (newEmail, otp) => {
  const response = await api.post("/users/change-email/verify-otp", {
    newEmail,
    otp,
  });
  return response.data;
};

// Send OTP for account deletion
export const sendAccountDeletionOTP = async () => {
  const response = await api.post("/users/delete-account/send-otp");
  return response.data;
};

// Verify OTP and delete account
export const verifyAndDeleteAccount = async (otp) => {
  const response = await api.post("/users/delete-account/verify-otp", { otp });
  return response.data;
};

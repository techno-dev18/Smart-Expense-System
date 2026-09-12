import API from "./api";

// Add a new expense
export const addExpense = async (expenseData) => {
  const response = await API.post("/expenses", expenseData);
  return response.data;
};

// Get all expenses
export const getExpenses = async () => {
  const response = await API.get("/expenses");
  return response.data;
};

// Get one expense
export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const response = await API.put(
    `/expenses/${id}`,
    expenseData
  );

  return response.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};
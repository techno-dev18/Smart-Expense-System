import API from "./api";

// Add budget
export const addBudget = async (budgetData) => {
  const response = await API.post(
    "/budgets",
    budgetData
  );

  return response.data;
};

// Get budgets
export const getBudgets = async () => {
  const response = await API.get("/budgets");

  return response.data;
};

// Get one budget
export const getBudgetById = async (id) => {
  const response = await API.get(
    `/budgets/${id}`
  );

  return response.data;
};

// Update budget
export const updateBudget = async (
  id,
  budgetData
) => {
  const response = await API.put(
    `/budgets/${id}`,
    budgetData
  );

  return response.data;
};

// Delete budget
export const deleteBudget = async (id) => {
  const response = await API.delete(
    `/budgets/${id}`
  );

  return response.data;
};
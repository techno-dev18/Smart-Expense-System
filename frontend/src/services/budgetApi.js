import API from "./api";

/* ========================================
   GET ALL BUDGETS
   ======================================== */

export const getBudgets = async () => {
  const response = await API.get("/budgets");
  return response.data;
};


/* ========================================
   MONTHLY BUDGET
   ======================================== */

// Add a monthly budget
export const addMonthlyBudget = async (budgetData) => {
  const response = await API.post(
    "/budgets/monthly",
    budgetData
  );

  return response.data;
};

// Update a monthly budget
export const updateMonthlyBudget = async (
  id,
  budgetData
) => {
  const response = await API.put(
    `/budgets/monthly/${id}`,
    budgetData
  );

  return response.data;
};

// Delete a monthly budget
export const deleteMonthlyBudget = async (id) => {
  const response = await API.delete(
    `/budgets/monthly/${id}`
  );

  return response.data;
};


/* ========================================
   CATEGORY BUDGET
   ======================================== */

// Add a category sub-budget
export const addCategoryBudget = async (budgetData) => {
  const response = await API.post(
    "/budgets/category",
    budgetData
  );

  return response.data;
};

// Get one category budget
export const getBudgetById = async (id) => {
  const response = await API.get(
    `/budgets/${id}`
  );

  return response.data;
};

// Update a category sub-budget
export const updateCategoryBudget = async (
  id,
  budgetData
) => {
  const response = await API.put(
    `/budgets/${id}`,
    budgetData
  );

  return response.data;
};

// Delete a category sub-budget
export const deleteCategoryBudget = async (id) => {
  const response = await API.delete(
    `/budgets/${id}`
  );

  return response.data;
};


/* ========================================
   BACKWARD-COMPATIBLE ALIASES
   ======================================== */

// Keep these aliases if other components still
// import addBudget, updateBudget, or deleteBudget.

export const addBudget = addCategoryBudget;

export const updateBudget = updateCategoryBudget;

export const deleteBudget = deleteCategoryBudget;
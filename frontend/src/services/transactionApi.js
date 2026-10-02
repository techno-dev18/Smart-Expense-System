import API from "./api";

/**
 * Extract an array from the API response.
 *
 * The backend may return:
 * - an array directly
 * - { expenses: [...] }
 * - { income: [...] }
 * - { data: [...] }
 */
const extractArray = (responseData, possibleKeys = []) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (!responseData || typeof responseData !== "object") {
    return [];
  }

  for (const key of possibleKeys) {
    if (Array.isArray(responseData[key])) {
      return responseData[key];
    }
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }

  return [];
};

/**
 * Get all transactions by combining
 * expenses and income.
 */
export const getTransactions = async () => {
  const [expenseResponse, incomeResponse] = await Promise.all([
    API.get("/expenses"),
    API.get("/income"),
  ]);

  const expenses = extractArray(expenseResponse.data, [
    "expenses",
  ]).map((expense) => ({
    ...expense,
    transactionType: "expense",
  }));

  const income = extractArray(incomeResponse.data, [
    "income",
  ]).map((item) => ({
    ...item,
    transactionType: "income",
  }));

  return [...expenses, ...income].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};

/**
 * Delete an expense transaction.
 */
export const deleteExpenseTransaction = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

/**
 * Delete an income transaction.
 */
export const deleteIncomeTransaction = async (id) => {
  const response = await API.delete(`/income/${id}`);
  return response.data;
};
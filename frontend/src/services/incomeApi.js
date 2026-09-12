import API from "./api";

// Add income
export const addIncome = async (incomeData) => {
  const response = await API.post("/income", incomeData);
  return response.data;
};

// Get all income
export const getIncome = async () => {
  const response = await API.get("/income");
  return response.data;
};

// Get one income
export const getIncomeById = async (id) => {
  const response = await API.get(`/income/${id}`);
  return response.data;
};

// Update income
export const updateIncome = async (id, incomeData) => {
  const response = await API.put(
    `/income/${id}`,
    incomeData
  );

  return response.data;
};

// Delete income
export const deleteIncome = async (id) => {
  const response = await API.delete(`/income/${id}`);
  return response.data;
};
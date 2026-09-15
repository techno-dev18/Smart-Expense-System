import API from "./api";


// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await API.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};


// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (
  email,
  password
) => {
  const response = await API.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};


// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const response = await API.get(
    "/auth/me"
  );

  return response.data;
};
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../services/authApi";


// ==========================================
// AUTH CONTEXT
// ==========================================

export const AuthContext =
  createContext();


// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // RESTORE AUTHENTICATION
  // ========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    const savedToken =
      localStorage.getItem("token");


    if (
      savedUser &&
      savedToken
    ) {

      try {

        setUser(
          JSON.parse(savedUser)
        );

        setToken(savedToken);

      } catch (error) {

        console.error(
          "Restore Auth Error:",
          error
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );

        setUser(null);

        setToken(null);
      }
    }


    setLoading(false);

  }, []);


  // ========================================
  // LOGIN
  // ========================================

  const login = async (
    email,
    password
  ) => {

    const data =
      await loginUser(
        email,
        password
      );


    const {
      token,
      user,
    } = data;


    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    setToken(token);

    setUser(user);


    return data;
  };


  // ========================================
  // SIGNUP
  // ========================================

  const signup = async (
    name,
    email,
    password
  ) => {

    const data =
      await registerUser(
        name,
        email,
        password
      );


    const {
      token,
      user,
    } = data;


    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    setToken(token);

    setUser(user);


    return data;
  };


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    setToken(null);

    setUser(null);
  };


  // ========================================
  // CONTEXT VALUE
  // ========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ==========================================
// USE AUTH HOOK
// ==========================================

export const useAuth = () => {
  return useContext(
    AuthContext
  );
};
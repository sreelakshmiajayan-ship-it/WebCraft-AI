import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(apiUrl("/api/auth/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
      } else {
        setToken(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    
    setToken(data.token);
    setUser(data.user);
    navigate("/");
    return data;
  };

  const signup = async (name, email, password) => {
    const res = await fetch(apiUrl("/api/auth/signup"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    
    setToken(data.token);
    setUser(data.user);
    navigate("/");
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

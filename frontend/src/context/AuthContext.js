import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// ── Demo users — change these to real credentials or connect to your backend ──
const DEMO_USERS = [
  {
    email: "admin@aiscout.in",
    password: "Scout@2024",
    name: "Admin User",
    role: "Admin",
    avatar: "AU",
  },
  {
    email: "hr.manager@aiscout.in",
    password: "HRManager@1",
    name: "HR Manager",
    role: "HR Manager",
    avatar: "HM",
  },
  {
    email: "recruiter@aiscout.in",
    password: "Recruit@99",
    name: "Recruiter",
    role: "Recruiter",
    avatar: "RC",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("aiscout_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    // Simulate async API delay — replace this block with a real fetch() call later
    await new Promise((r) => setTimeout(r, 900));

    const found = DEMO_USERS.find(
      (u) =>
        u.email === email.trim().toLowerCase() &&
        u.password === password
    );

    if (found) {
      const userObj = {
        name:   found.name,
        email:  found.email,
        role:   found.role,
        avatar: found.avatar,
      };
      setUser(userObj);
      sessionStorage.setItem("aiscout_user", JSON.stringify(userObj));
      setLoading(false);
      return true;
    } else {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("aiscout_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
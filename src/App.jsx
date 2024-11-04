import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/Login";
import Dashboard from "./components/Dashbaord"; // Ensure the correct path
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const handleLogin = () => {
    setToken(true); // Set authentication state to true
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !token ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/login"
          element={<LoginComponent onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

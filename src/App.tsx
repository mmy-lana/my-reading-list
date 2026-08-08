import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeProvider";
import { LanguageProvider } from "./utils/i18n";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import PrivateRoute from "./pages/privateRoute/PrivateRoute";
import { injectWatermark } from "./utils/watermark";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  useEffect(() => {
    injectWatermark();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-text-primary dark:bg-backgroundDark dark:text-textDark-primary transition-colors duration-300">
                        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./utils/ThemeProvider";
import { LanguageProvider } from "./utils/i18n";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import PrivateRoute from "./pages/privateRoute/PrivateRoute";
import { injectWatermark } from "./utils/watermark";
import AdminDashboard from "./components/admin/AdminDashboard";
import AllComics from "./pages/all/AllComics";

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all" element={<AllComics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  useEffect(() => {
    injectWatermark();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;

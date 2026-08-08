import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in with:", email, password);
    // For now, simulate a login and store a token
    localStorage.setItem("token", "dummy-token");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-800 shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <div>
        <input
          type="email"
          className="w-full p-2.5 mb-4 border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2.5 mb-4 border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full p-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow transition-colors"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

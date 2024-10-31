import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from 'js-cookie'; // Import js-cookie

const LoginComponent = ({ setIsAuthenticated }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [darkMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        
        // Store token in cookies instead of local storage
        Cookies.set('token', data.token, { expires: 7 }); // Expires in 7 days
        Cookies.set('userData', JSON.stringify({
          id: data._id,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          username: data.username
        }), { expires: 7 }); // Store user data in cookies

        // Call the function to update the authentication status
        setIsAuthenticated(true);

        // Navigate to home if the user data exists
        if (data._id && data.token) {
          navigate("/home"); // Ensure you're navigating to the correct route
        } else {
          setError("Unable to authenticate. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900" : "bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50"}`}>
      <div className={`max-w-md w-full space-y-8 ${darkMode ? "bg-gray-800/30" : "bg-white/30"} p-10 rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out backdrop-blur-xl border ${darkMode ? "border-gray-700/30" : "border-gray-200/30"} ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 p-4 rounded-xl">
              <Icon icon="mdi:shield-lock" className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">LCA PORTAL</h2>
          <h2 className="mt-2 text-xl font-bold text-gray-400">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100/10 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:email" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-700 placeholder-gray-400 text-gray-300 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:lock" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-700 placeholder-gray-400 text-gray-300 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded-md bg-gray-900/50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Icon icon="mdi:login" className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300" />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;

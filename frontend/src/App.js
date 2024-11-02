import "./output.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import SettingsComponent from "./routes/Settings";
import ExportReportsComponent from "./routes/Export";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import ProtectedRoute from "./components/shared/ProtectedRoute"; 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token in cookies on initial load
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true); // Set authenticated state if token exists
    }
  }, []);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        <Routes>
          {/* Protect root / route */}
          <Route 
            path="/" 
            element={
              isAuthenticated 
                ? <HomeComponent /> 
                : <Navigate to="/login" replace /> 
            } 
          />
          
          <Route path="/login" element={<LoginComponent setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupComponent />} />

          {/* Protect /home route with ProtectedRoute */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomeComponent />
              </ProtectedRoute>
            } 
          />

          <Route path="/setting" element={<SettingsComponent />} />

          {/* Protect /exports route with ProtectedRoute */}
          <Route 
            path="/exports" 
            element={
              <ProtectedRoute>
                <ExportReportsComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

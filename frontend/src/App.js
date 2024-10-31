import "./output.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import SettingsComponent from "./routes/Settings";
import ExportComponent from "./routes/Export";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import React, { useState, useEffect } from "react"; // Correctly import useEffect

import Cookies from 'js-cookie';

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
          <Route path='/' element={<HomeComponent />} />
          <Route path='/login' element={<LoginComponent setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/signup' element={<SignupComponent />} />
          <Route path='/home' element={
            <ProtectedRoute
              element={<HomeComponent />}
              isAuthenticated={isAuthenticated}
            />
          } />
          <Route path='/setting' element={<SettingsComponent />} />
          <Route path='/exports' element={
            <ProtectedRoute
              element={<ExportComponent/>}
              isAuthenticated={isAuthenticated}
            />
            } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

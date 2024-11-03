import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

function NavbarComponent({ darkMode }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    Cookies.remove("token"); 
    window.location.href = '/login'; 
  };

  return (
    <nav className={`backdrop-blur-xl ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-white/40'} border-b sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="/home"
              className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              LCA Dashboard
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white' : 'bg-gray-200/30 text-white'}`}
            >
              <Icon icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"} className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="/home"
              className={`p-3 rounded-xl backdrop-blur-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300 flex items-center gap-2`}
            >
              <Icon icon="mdi:view-dashboard" className="w-6 h-6" />
              <span>Dashboard</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="/exports"
              className={`p-3 rounded-xl backdrop-blur-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300 flex items-center gap-2`}
            >
              <Icon icon="mdi:file-document" className="w-6 h-6" />
              <span>Reports</span>
            </motion.a>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className={`p-3 rounded-xl backdrop-blur-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300`}
            >
              <Icon icon="mdi:bell" className="w-6 h-6" />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200/30 hover:bg-gray-300/30'} flex items-center justify-center transition-all duration-300`}
              >
                <Icon icon="mdi:account" className="text-white" width="24" height="24" />
              </motion.button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-4 w-64 bg-white border-gray-200 rounded-2xl shadow-2xl py-1 border transition-all duration-300 backdrop-blur-lg"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <p className="text-lg font-semibold">LCA Industrial Solutions</p>
                    <p className="text-sm text-gray-600">Enterprise Solutions</p>
                  </div>
                  <motion.a
                    whileHover={{ backgroundColor: 'rgba(229, 231, 235, 0.5)' }}
                    href="#"
                    className="block px-6 py-3 text-sm text-gray-900 hover:bg-gray-200/50 transition-colors duration-200"
                  >
                    Company Profile
                  </motion.a>
                  <motion.a
                    whileHover={{ backgroundColor: 'rgba(229, 231, 235, 0.5)' }}
                    href="#"
                    className="block px-6 py-3 text-sm text-gray-900 hover:bg-gray-200/50 transition-colors duration-200"
                  >
                    Settings
                  </motion.a>
                  <div className="border-t border-gray-200">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(229, 231, 235, 0.5)' }}
                      onClick={handleSignOut} 
                      className="w-full text-left px-6 py-3 text-sm text-red-500 transition-all duration-200"
                    >
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/home"
                className={`block p-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300`}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:view-dashboard" className="w-6 h-6" />
                  <span>Dashboard</span>
                </div>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/exports"
                className={`block p-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300`}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:file-document" className="w-6 h-6" />
                  <span>Reports</span>
                </div>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full p-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white hover:bg-gray-600/50' : 'bg-gray-200/30 text-white hover:bg-gray-300/30'} transition-all duration-300`}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:account" className="w-6 h-6" />
                  <span>Profile</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default NavbarComponent;

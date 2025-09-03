import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  FileText,
  Activity,
  ChevronDown,
  BarChart3,
  Wifi,
  Cable,
  Radio,
  Zap,
  Shield,
  Database,
  House,
} from 'lucide-react';

import Signin from './components/SignIn/Signin';
import Document from './components/Document/Document';
import RealTimeData from './components/RealTimeData/RealTimeData';
import Oee from './components/Oee/Oee';
import Home from './components/Home/Home';
import Header from './components/Header/Header';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }}
      />
    ))}
  </div>
);

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // Auto-expand Real-Time Data if we're on any of its sub-pages
  useEffect(() => {
    if (location.pathname.startsWith('/realtime')) {
      setExpandedItems(prev => ({
        ...prev,
        'Real-Time Data': true
      }));
    }
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: House, path: '/' },
    { name: 'Login', icon: LogIn, path: '/login' },
    { name: 'Machine Specifications', icon: FileText, path: '/specifications' },
    {
      name: 'Real-Time Data',
      icon: Activity,
      path: '/realtime',
      subItems: [
        { name: 'OPC UA', icon: Database, path: '/realtime/opcua' },
        { name: 'RS232', icon: Cable, path: '/realtime/rs232' },
        { name: 'MODBUS TCP/IP', icon: Wifi, path: '/realtime/modbus' },
        { name: 'RS485', icon: Radio, path: '/realtime/rs485' }
      ]
    },
    { name: 'Overall Equipment Effectiveness', icon: BarChart3, path: '/oee' }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-r border-gray-700/50 shadow-2xl z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-80' : 'w-20'} lg:${isOpen ? 'w-80' : 'w-20'}`}>

        {/* Sidebar Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Control Panel
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="relative p-2 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg border border-gray-600/50"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            {isOpen ? <X className="w-5 h-5 relative z-10" /> : <Menu className="w-5 h-5 relative z-10" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <div className="group">
                {item.subItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 overflow-hidden group ${location.pathname.startsWith(item.path)
                      ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/20 shadow-lg ring-1 ring-blue-400/30'
                      : 'hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/10 hover:shadow-lg hover:ring-1 hover:ring-blue-400/20'
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="flex items-center relative z-10">
                      <div className="relative">
                        <item.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110" />
                        <div className="absolute -inset-1 bg-blue-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                      </div>
                      {isOpen && (
                        <span className="ml-3 text-white font-medium group-hover:text-blue-300 transition-all duration-300">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <div className="relative z-10 transform transition-all duration-300">
                        <div className={`p-1 rounded-lg ${expandedItems[item.name] ? 'bg-blue-500/20 rotate-180' : 'bg-gray-600/20 group-hover:bg-blue-500/20'}`}>
                          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-all duration-300" />
                        </div>
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative flex items-center p-3 rounded-xl transition-all duration-300 overflow-hidden group ${location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/20 shadow-lg ring-1 ring-blue-400/30'
                      : 'hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/10 hover:shadow-lg hover:ring-1 hover:ring-blue-400/20'
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative z-10 flex items-center">
                      <div className="relative">
                        <item.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110" />
                        <div className="absolute -inset-1 bg-blue-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                      </div>
                      {isOpen && (
                        <span className="ml-3 text-white font-medium group-hover:text-blue-300 transition-all duration-300">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {location.pathname === item.path && (
                      <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg" />
                    )}
                  </Link>
                )}
              </div>

              {/* Sub Items */}
              {item.subItems && expandedItems[item.name] && isOpen && (
                <div className="ml-6 mt-2 space-y-2 animate-in slide-in-from-top duration-300">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`relative flex items-center p-3 rounded-lg transition-all duration-300 overflow-hidden group ${location.pathname === subItem.path
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg ring-1 ring-purple-400/30'
                        : 'hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-md hover:ring-1 hover:ring-purple-400/20 hover:translate-x-1'
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="relative z-10 flex items-center">
                        <div className="relative">
                          <subItem.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-all duration-300 group-hover:scale-110" />
                          <div className="absolute -inset-1 bg-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                        </div>
                        <span className="ml-3 text-sm text-gray-300 group-hover:text-purple-300 transition-all duration-300 font-medium">
                          {subItem.name}
                        </span>
                      </div>
                      {location.pathname === subItem.path && (
                        <div className="absolute right-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg" />
                      )}
                      <div className="absolute left-0 top-1/2 w-0.5 h-0 bg-gradient-to-b from-purple-400 to-transparent group-hover:h-full transition-all duration-300 transform -translate-y-1/2" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-slate-900/50 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-4 backdrop-blur-sm border border-green-400/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5 animate-pulse" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-sm">
                  <div className="relative">
                    <Shield className="w-4 h-4 text-green-400" />
                    <div className="absolute -inset-1 bg-green-400/20 rounded-full blur animate-pulse" />
                  </div>
                  <span className="text-green-400 font-medium">Secure Connection</span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400/50 to-transparent rounded" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  <span>Edge Device Status: Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
// Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Add this line

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]); // Now using the hook-based location

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`flex-1 w-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'}`}>
          <div className="p-5 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/specifications" element={<Document />} />
              <Route path="/realtime/*" element={<RealTimeData />} />
              <Route path="/oee" element={<Oee />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
};

// Wrap App with BrowserRouter
const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
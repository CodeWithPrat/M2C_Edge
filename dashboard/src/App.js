import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  FileText,
  Activity,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Wifi,
  Cable,
  Radio,
  Settings,
  Zap,
  Shield,
  Cpu,
  Database,
  ChevronLeft
} from 'lucide-react';

import Signin from './components/SignIn/Signin';
import Document from './components/Document/Document';
import RealTimeData from './components/RealTimeData/RealTimeData';

import cmtiLogo from "../src/images/logos/CMTILogo.png"
import mhiLogo from "../src/images/logos/MHI3.png"
import M2CLogo from "../src/images/logos/M2CLogo.png"

import pic1 from "./images/RAWPics/IMG20250820110825-removebg-preview.png"
import pic2 from "./images/RAWPics/IMG20250820111137-removebg-preview.png"
import pic3 from "./images/RAWPics/IMG20250820111147-removebg-preview.png"
import pic4 from "./images/RAWPics/IMG20250820111205-removebg-preview.png"
import pic5 from "./images/RAWPics/IMG20250820111333-removebg-preview.png"
import pic6 from "./images/RAWPics/IMG20250820111354-removebg-preview.png"
import pic7 from "./images/RAWPics/M2C.png"

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

  const menuItems = [
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-80' : 'w-20'} lg:${isOpen ? 'w-80' : 'w-20'}`}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {isOpen && (
            <h2 className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Navigation
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200 hover:scale-110"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div className="group">
                {item.subItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg hover:scale-105 ${location.pathname.startsWith(item.path) ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg' : 'hover:bg-gray-800/50'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                      {isOpen && (
                        <span className="ml-3 text-white font-medium group-hover:text-blue-300 transition-colors duration-200">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <div className="transform transition-transform duration-200">
                        {expandedItems[item.name] ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg hover:scale-105 group ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg' : 'hover:bg-gray-800/50'
                      }`}
                  >
                    <item.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                    {isOpen && (
                      <span className="ml-3 text-white font-medium group-hover:text-blue-300 transition-colors duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Sub Items */}
              {item.subItems && expandedItems[item.name] && isOpen && (
                <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top duration-300">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:pl-4 group ${location.pathname === subItem.path ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30' : 'hover:bg-gray-700/50'
                        }`}
                    >
                      <subItem.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {subItem.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Shield className="w-4 h-4" />
                <span>Secure Connection</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Edge Device Status: Active
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Header Component
const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header
      className={`relative z-10 bg-black/80 border-b border-gray-800 shadow-2xl flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-80" : "lg:ml-20"
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex-shrink-0 group">
            <img
              src={cmtiLogo}
              alt="CMTI Logo"
              className="w-32 h-24 drop-shadow-md"
            />
          </div>

          {/* Center Content */}
          <div className="text-center flex-grow mx-8">
            {/* Institute Name */}
            <h1
              className="text-2xl lg:text-5xl font-extrabold mb-2 
              bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100 
              bg-clip-text text-transparent drop-shadow-lg"
            >
              Central Manufacturing Technology Institute
            </h1>

            {/* Sub Heading */}
            <p className="text-lg text-gray-300 mb-3 opacity-90 italic">
              (An autonomous R&amp;D Institute under the Ministry of Heavy
              Industries, Govt. of India)
            </p>

            {/* Dashboard Box */}
            <div
              className="relative rounded-xl px-6 py-3 shadow-lg
              bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
              border border-gray-600/40 overflow-hidden"
            >
              {/* Shiny Overlay Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                animate-[shine_3s_linear_infinite]"
              ></div>

              <h2 className="text-lg font-semibold text-gray-100 flex items-center justify-center gap-2 tracking-wide">
                <Zap className="w-5 h-5 text-yellow-400 drop-shadow-md" />
                <span
                  className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100 
                  bg-clip-text text-transparent font-extrabold"
                >
                  Machine To Cloud Connecting EDGE Device
                </span>
                <Wifi className="w-5 h-5 text-blue-400 animate-bounce drop-shadow-lg" />
              </h2>
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex-shrink-0 group">
            <img src={mhiLogo} alt="MHI Logo" className="w-32 h-32" />
          </div>
        </div>
      </div>
    </header>
  );
};

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock product images - in real app, these would be actual image URLs
  const productImages = [
    {
      id: 1,
      image: pic5
    },
    {
      id: 2,
      image: pic3
    },
    {
      id: 3,
      image: pic4
    },
    {
      id: 4,
      image: pic1
    }
  ];


  const features = [
    {
      icon: Cpu,
      title: "Edge AI Processing",
      description: "Advanced machine learning capabilities at the edge for real-time decision making",
      color: "text-blue-400",
      bgColor: "from-blue-500/10 to-blue-600/5"
    },
    {
      icon: Wifi,
      title: "Multi-Protocol Support",
      description: "Compatible with Modbus, OPC-UA, MQTT, and other industrial protocols",
      color: "text-green-400",
      bgColor: "from-green-500/10 to-green-600/5"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption with secure boot and hardware-based security",
      color: "text-purple-400",
      bgColor: "from-purple-500/10 to-purple-600/5"
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Process and analyze data in milliseconds with low-latency computing",
      color: "text-yellow-400",
      bgColor: "from-yellow-500/10 to-yellow-600/5"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Intelligent data filtering and compression before cloud transmission",
      color: "text-cyan-400",
      bgColor: "from-cyan-500/10 to-cyan-600/5"
    },
    {
      icon: Settings,
      title: "Remote Configuration",
      description: "Over-the-air updates and remote device management capabilities",
      color: "text-pink-400",
      bgColor: "from-pink-500/10 to-pink-600/5"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % productImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, productImages.length]);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % productImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToImage = (index) => {
    if (isTransitioning || index === currentImage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">

        {/* Main Content - Module Description & Product Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start">
          {/* Left Side - Module Description */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-700 hover:shadow-blue-500/20 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-5">
                <div className="">
                  <img
                    src={M2CLogo}
                    alt="M2C Edge Module Logo"
                    className="w-34 h-20"
                  />
                </div>

                <h2 className="text-3xl font-bold text-white">
                  M2C Edge Module
                </h2>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Our cutting-edge industrial IoT edge computing module is designed to revolutionize manufacturing operations.
                Built for harsh industrial environments, it provides real-time data processing, advanced analytics, and
                seamless cloud connectivity to optimize your production efficiency.
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-700/50 hover:border-purple-500/50 transition-all duration-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-7 h-7 text-purple-400" />
                Technical Specifications
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Processor", value: "ARM Cortex-A72 Quad-core @ 1.5GHz" },
                  { label: "Memory", value: "4GB LPDDR4 + 32GB eMMC" },
                  { label: "Connectivity", value: "WiFi 6, Gigabit Ethernet, 4G/5G" },
                  { label: "I/O Ports", value: "RS485, CAN, Digital I/O, Analog" },
                  { label: "Operating Temp", value: "-40°C to +85°C" },
                  { label: "Power", value: "12-24V DC, <15W consumption" }
                ].map((spec, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors duration-300">
                    <span className="text-gray-300 font-medium">{spec.label}</span>
                    <span className="text-purple-400 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Image Carousel */}
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-700/50 hover:border-blue-500/50 transition-all duration-700 hover:shadow-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Product Gallery
              </h3>

              {/* Main Image Display */}
              <div className="relative group mb-8">
                {/* Main Image Container */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
                  {/* Decorative Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Image Container */}
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className={`relative w-full h-full transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                      <img
                        src={productImages[currentImage].image}
                        alt={productImages[currentImage].alt}
                        className="w-full h-full object-contain rounded-2xl shadow-lg scale-110"
                        style={{
                          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))'
                        }}
                      />

                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    disabled={isTransitioning}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg border border-white/20 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextImage}
                    disabled={isTransitioning}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg border border-white/20 disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-6 right-6 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                    {currentImage + 1} / {productImages.length}
                  </div>
                </div>
              </div>

              {/* Auto-play toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAutoPlaying
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="animate-fade-in-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the advanced capabilities that make our IoT edge platform the perfect choice for industrial automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};


const OEE = () => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50">
    <h2 className="text-3xl font-bold text-white mb-6">Overall Equipment Effectiveness</h2>
    <p className="text-gray-300 text-lg">OEE metrics and analytics will be displayed here.</p>
  </div>
);

// Main App Component
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

        <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
          }`}>
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/specifications" element={<Document />} />
              <Route path="/realtime/*" element={<RealTimeData />} />
              <Route path="/oee" element={<OEE />} />
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
import React, { useState, useEffect, useRef, useCallback } from "react";
import GaugeComponent from "react-gauge-component";
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowLeftRight, ArrowUpDown, Settings, Zap, Gauge, Activity, Thermometer, BarChart3, Move3D, MonitorSpeaker } from 'lucide-react';

// Enhanced error handler for React Gauge Component
if (typeof window !== "undefined") {
  const handleError = (e) => {
    if (e.message?.includes('ResizeObserver')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('ResizeObserver')) e.preventDefault();
  });

  const originalRO = window.ResizeObserver;
  window.ResizeObserver = class extends originalRO {
    constructor(callback) {
      super((entries, observer) => {
        requestAnimationFrame(() => {
          try { callback(entries, observer); }
          catch (e) { if (!e.message.includes('ResizeObserver')) console.error(e); }
        });
      });
    }
  };
}

// Stable Gauge Component (same as in spindle)
const StableGauge = ({ value, ...props }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(() => {
      debounce(() => setDisplayValue(value), 150)();
    });
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [value]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", contain: "layout paint style", transform: "translateZ(0)" }}>
      <GaugeComponent value={displayValue} {...props} style={{ width: "100%", height: "100%", contain: "content" }} />
    </div>
  );
};

// Enhanced Axis Animation Component (unchanged)
const AxisAnimation = ({
  axisName,
  position,
  speed,
  torque,
  power,
  direction,
  limits = { min: 0, max: 500 },
  axisColor = "blue"
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (speed > 0) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [speed]);

  const normalizedPosition = ((position - limits.min) / (limits.max - limits.min)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, normalizedPosition));

  const getAxisDirection = () => {
    switch (axisName) {
      case 'X': return { transform: 'none', motion: 'horizontal', orientation: 'horizontal' };
      case 'Y': return { transform: 'none', motion: 'vertical', orientation: 'vertical' };
      case 'Z': return { transform: 'perspective(1000px) rotateX(-20deg)', motion: 'depth', orientation: 'horizontal' };
      default: return { transform: 'none', motion: 'horizontal', orientation: 'horizontal' };
    }
  };

  const axisConfig = getAxisDirection();
  const colorMap = {
    'X': { primary: 'from-red-400 to-red-600', secondary: 'red-400', accent: 'border-red-400/50' },
    'Y': { primary: 'from-green-400 to-green-600', secondary: 'green-400', accent: 'border-green-400/50' },
    'Z': { primary: 'from-blue-400 to-blue-600', secondary: 'blue-400', accent: 'border-blue-400/50' }
  };

  const colors = colorMap[axisName];

  return (
    <div className="relative bg-gradient-to-br from-gray-900/95 via-black/90 to-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.primary} animate-pulse`}></div>
            <h3 className={`text-xl font-bold text-${colors.secondary}`}>
              {axisName}-Axis
            </h3>
          </div>

          <div className="text-right">
            <div className={`text-xl font-bold text-${colors.secondary} mb-1`}>
              {position.toFixed(2)} <span className="text-sm text-gray-400">mm</span>
            </div>
            <div className="text-xs text-gray-400">
              {clampedPosition.toFixed(1)}% travel
            </div>
          </div>
        </div>

        {/* Direction Indicator */}
        <div className="flex items-center gap-2 mt-2 text-gray-400">
          {axisName === 'X' && <ArrowLeftRight size={16} />}
          {axisName === 'Y' && <ArrowUpDown size={16} />}
          {axisName === 'Z' && <Move3D size={16} />}
          <span className="text-sm">{axisConfig.motion} movement</span>
          <div className={`ml-2 w-2 h-2 rounded-full ${speed > 0 ? `bg-${colors.secondary} animate-pulse` : 'bg-gray-500'}`}></div>
          <span className="text-xs">{speed > 0 ? 'Active' : 'Idle'}</span>
        </div>
      </div>

      {/* Main Animation Area - Different height for Y-axis */}
      <div className={`relative ${axisName === 'Y' ? 'h-[460px] w-44 mx-auto' : 'h-32'} bg-gradient-to-b from-gray-800/30 to-gray-900/50 rounded-xl mb-6 overflow-hidden`}
        style={{ transform: axisConfig.transform }}>

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Scale Markers */}
        <div className={`absolute ${axisName === 'Y' ? 'top-2 bottom-2 flex flex-col justify-between' : 'top-2 left-4 right-4 flex justify-between'} text-xs text-gray-400`}>
          {[0, 25, 50, 75, 100].map(percent => (
            <div key={percent} className={`${axisName === 'Y' ? 'text-center h-full flex flex-col justify-between' : 'text-center'}`}>
              <div className={`${axisName === 'Y' ? 'w-3 h-px' : 'w-px h-3'} bg-${colors.secondary}/50 mx-auto`}></div>
              <span>{((limits.max - limits.min) * percent / 100 + limits.min).toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* Guide Rails - Vertical for Y-axis */}
        {axisName === 'Y' ? (
          <>
            <div className="absolute top-4 left-8 bottom-4 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-full"></div>
            <div className="absolute top-4 right-8 bottom-4 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-full"></div>
          </>
        ) : (
          <>
            <div className="absolute top-8 left-4 right-4 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full"></div>
            <div className="absolute bottom-8 left-4 right-4 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full"></div>
          </>
        )}
        <div
          className={`absolute top-1/2 left-8 right-8 transform -translate-y-1/2 
    ${axisName === 'Y' ? 'w-6 h-full ml-11' : 'w-full h-6'}`}
        >
          {/* Shaft Base */}
          <div className="w-full h-full bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 rounded-full shadow-lg relative overflow-hidden">
            {/* Rotating Pattern */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: axisName === 'Y'
                  ? `repeating-linear-gradient(
              135deg,
              rgba(156, 163, 175, 0.3) 0px,
              rgba(156, 163, 175, 0.3) 4px,
              transparent 4px,
              transparent 8px
            )`
                  : `repeating-linear-gradient(
              45deg,
              rgba(156, 163, 175, 0.3) 0px,
              rgba(156, 163, 175, 0.3) 4px,
              transparent 4px,
              transparent 8px
            )`,
                animation: speed > 0 ? 'rotate-pattern 2s linear infinite' : 'none'
              }}
            ></div>

            {/* Metallic Shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 rounded-full"></div>
          </div>
        </div>


        {/* Moving Component - Different positioning for Y-axis */}
        <div
          className={`absolute ${axisName === 'Y' ? 'left-1/2 w-16 h-12 -translate-x-1/2' : 'top-1/2 h-12 w-16 -translate-y-1/2'} transition-all duration-500 ease-out z-10`}
          style={{
            [axisName === 'Y' ? 'bottom' : 'left']: `calc(1rem + ${clampedPosition * (axisName === 'Y' ? 0.85 : 0.8)}%)`,
            transform: axisName === 'Y' ? 'translateX(-50%)' : 'translateY(-50%)',
          }}
        >
          <div className={`w-full h-full bg-gradient-to-br ${colors.primary}/30 backdrop-blur-sm rounded-lg border ${colors.accent} shadow-2xl relative overflow-hidden`}>
            {/* Glowing edge effect */}
            <div className={`absolute inset-0 rounded-lg border-2 ${colors.accent} ${speed > 0 ? 'animate-pulse' : ''}`}></div>

            {/* Internal details */}
            <div className="absolute inset-1 bg-gradient-to-b from-white/10 to-transparent rounded"></div>
            <div className={`absolute top-1/2 left-1/2 w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 bg-${colors.secondary} rounded-full shadow-lg`}></div>

            {/* Position label */}
            <div className={`absolute ${axisName === 'Y' ? '-right-20 top-1/2 -translate-y-1/2' : '-top-8 left-1/2 -translate-x-1/2'} text-xs text-${colors.secondary} font-bold bg-black/80 px-2 py-1 rounded whitespace-nowrap`}>
              {position.toFixed(1)}mm
            </div>
          </div>
        </div>

        {/* Motion Trail - Different orientation for Y-axis */}
        {speed > 0 && (
          <div
            className={`absolute ${axisName === 'Y' ? 'left-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-${colors.secondary}/40 to-transparent transform -translate-x-1/2 transition-all duration-500' : 'top-1/2 h-1 bg-gradient-to-r from-transparent via-${colors.secondary}/40 to-transparent transform -translate-y-1/2 transition-all duration-500'}`}
            style={{
              [axisName === 'Y' ? 'bottom' : 'left']: `calc(1rem + ${clampedPosition * (axisName === 'Y' ? 0.85 : 0.8)}% - ${axisName === 'Y' ? 10 : 20}px)`,
              [axisName === 'Y' ? 'height' : 'width']: axisName === 'Y' ? '20px' : '40px',
              opacity: Math.min(1, speed / 1000)
            }}
          />
        )}

        {/* Motor - Different positioning for Y-axis */}
        <div className={`absolute ${axisName === 'Y' ? 'top-2 left-1/2 -translate-x-1/2' : 'top-1/2 left-2 -translate-y-1/2'} w-8 h-8`}>
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded border border-gray-600 relative">
            <Settings
              className={`absolute inset-0 m-auto w-5 h-5 text-yellow-400 ${speed > 0 ? 'animate-spin' : ''}`}
              style={{ animationDuration: speed > 0 ? `${Math.max(0.5, 2 - (speed / 5000))}s` : 'none' }}
            />
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${power > 1 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>

        {/* Status Indicators - Different positioning for Y-axis */}
        <div className={`absolute ${axisName === 'Y' ? 'right-2 top-1/2 -translate-y-1/2' : 'top-1/2 right-2 -translate-y-1/2'} flex ${axisName === 'Y' ? 'flex-col' : 'flex-col'} gap-1`}>
          <div className="bg-black/80 rounded p-1 border border-teal-500/50">
            <div className="flex items-center gap-1 text-xs text-teal-400">
              <Gauge size={10} />
              <span className="text-xs">{torque.toFixed(1)}</span>
            </div>
          </div>
          <div className="bg-black/80 rounded p-1 border border-pink-500/50">
            <div className="flex items-center gap-1 text-xs text-pink-400">
              <Zap size={10} />
              <span className="text-xs">{power.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MM_Feed_drive = () => {
  // Simulated data states for 3 axes
  const [axesData, setAxesData] = useState({
    X: { speed: 2850, torque: 15.2, voltage: 380, current: 8.5, power: 5.8, temperature: 65, position: 125.5 },
    Y: { speed: 3200, torque: 18.7, voltage: 375, current: 9.2, power: 6.2, temperature: 72, position: 85.2 },
    Z: { speed: 1800, torque: 22.1, voltage: 385, current: 7.8, power: 4.9, temperature: 58, position: 42.8 }
  });

  const [selectedGraph, setSelectedGraph] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAxesData(prev => ({
        X: {
          speed: Math.max(0, prev.X.speed + (Math.random() - 0.5) * 200),
          torque: Math.max(0, prev.X.torque + (Math.random() - 0.5) * 2),
          voltage: Math.max(0, prev.X.voltage + (Math.random() - 0.5) * 10),
          current: Math.max(0, prev.X.current + (Math.random() - 0.5) * 1),
          power: Math.max(0, prev.X.power + (Math.random() - 0.5) * 0.8),
          temperature: Math.max(20, prev.X.temperature + (Math.random() - 0.5) * 3),
          position: Math.max(0, Math.min(500, prev.X.position + (Math.random() - 0.5) * 5))
        },
        Y: {
          speed: Math.max(0, prev.Y.speed + (Math.random() - 0.5) * 180),
          torque: Math.max(0, prev.Y.torque + (Math.random() - 0.5) * 2.2),
          voltage: Math.max(0, prev.Y.voltage + (Math.random() - 0.5) * 12),
          current: Math.max(0, prev.Y.current + (Math.random() - 0.5) * 1.1),
          power: Math.max(0, prev.Y.power + (Math.random() - 0.5) * 0.9),
          temperature: Math.max(25, prev.Y.temperature + (Math.random() - 0.5) * 2.8),
          position: Math.max(0, Math.min(400, prev.Y.position + (Math.random() - 0.5) * 4))
        },
        Z: {
          speed: Math.max(0, prev.Z.speed + (Math.random() - 0.5) * 150),
          torque: Math.max(0, prev.Z.torque + (Math.random() - 0.5) * 2.5),
          voltage: Math.max(0, prev.Z.voltage + (Math.random() - 0.5) * 8),
          current: Math.max(0, prev.Z.current + (Math.random() - 0.5) * 0.9),
          power: Math.max(0, prev.Z.power + (Math.random() - 0.5) * 0.7),
          temperature: Math.max(22, prev.Z.temperature + (Math.random() - 0.5) * 2.5),
          position: Math.max(0, Math.min(300, prev.Z.position + (Math.random() - 0.5) * 3))
        }
      }));

      // Add to historical data
      setHistoricalData(prev => {
        const timestamp = new Date().toLocaleTimeString();
        const newData = {
          timestamp,
          X_speed: axesData.X.speed,
          Y_speed: axesData.Y.speed,
          Z_speed: axesData.Z.speed,
          X_torque: axesData.X.torque,
          Y_torque: axesData.Y.torque,
          Z_torque: axesData.Z.torque,
          X_power: axesData.X.power,
          Y_power: axesData.Y.power,
          Z_power: axesData.Z.power
        };
        return [...prev.slice(-19), newData];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Gauge configuration (same as in spindle)
  const gaugeConfig = [
    { field: "speed", title: "Speed", unit: "RPM", color: "#22c55e", colorClass: "green", max: 10000, ticks: [2500, 5000, 7500, 10000], limits: [4000, 8000], decimals: 0 },
    { field: "torque", title: "Torque", unit: "Nm", color: "#14b8a6", colorClass: "teal", max: 50, ticks: [12.5, 25, 37.5, 50], limits: [20, 40], decimals: 1 },
    { field: "voltage", title: "Voltage", unit: "V", color: "#8b5cf6", colorClass: "purple", max: 480, ticks: [120, 240, 360, 480], limits: [192, 384], decimals: 1 },
    { field: "current", title: "Current", unit: "A", color: "#f59e0b", colorClass: "yellow", max: 20, ticks: [5, 10, 15, 20], limits: [8, 16], decimals: 1 },
    { field: "power", title: "Power", unit: "kW", color: "#ec4899", colorClass: "pink", max: 15, ticks: [3.75, 7.5, 11.25, 15], limits: [6, 12], decimals: 1 },
    { field: "temperature", title: "Temperature", unit: "°C", color: "#ef4444", colorClass: "red", max: 120, ticks: [30, 60, 90, 120], limits: [48, 96], decimals: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-8">

        {/* 3D Axes Animation Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mb-10 max-w-full mx-auto">
          {Object.entries(axesData).map(([axisName, data]) => (
            <div
              key={axisName}
              className={axisName === 'Y' ? ' w-80 xl:col-span-1 xl:row-span-2 mx-auto' : 'w-[600px] mx-auto'}
            >
              <AxisAnimation
                axisName={axisName}
                position={data.position}
                speed={data.speed}
                torque={data.torque}
                power={data.power}
                limits={
                  axisName === 'X' ? { min: 0, max: 500 } :
                    axisName === 'Y' ? { min: 0, max: 400 } :
                      { min: 0, max: 300 }
                }
              />
            </div>
          ))}
        </div>

        {/* Parameters Dashboard */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Real-Time Parameters Monitoring
          </h2>

          {gaugeConfig.map(config => (
            <div key={config.field} className="mb-8 bg-gradient-to-br from-black/95 via-gray-900/90 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-400">{config.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedGraph(selectedGraph?.field === config.field ? null : config)}
                  className={`p-2 rounded-lg transition-all duration-300 ${selectedGraph?.field === config.field
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-gray-700/50 text-gray-400 hover:text-cyan-400 hover:bg-gray-600/50'
                    }`}
                >
                  <TrendingUp size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(axesData).map(([axisName, data]) => {
                  const value = data[config.field];
                  const isSelected = selectedGraph?.field === config.field;

                  return (
                    <div key={`${config.field}-${axisName}`} className="text-center group bg-gradient-to-br from-black/95 via-gray-900/90 to-slate-900/95 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30 shadow-lg">
                      {/* Graph Icon */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">{axisName}-Axis</span>
                        <div className={`text-lg font-bold text-${config.colorClass}-400`}>
                          {value.toFixed(config.decimals)} <span className="text-xs">{config.unit}</span>
                        </div>
                      </div>

                      <div className="relative inline-block mb-4 h-48 w-full">
                        <StableGauge
                          value={value}
                          type="radial"
                          minValue={0}
                          maxValue={config.max}
                          labels={{
                            tickLabels: {
                              type: "inner",
                              ticks: config.ticks.map(value => ({ value }))
                            },
                            valueLabel: {
                              formatTextValue: (v) => v.toFixed(config.decimals) + " " + config.unit,
                              style: { fontSize: "16px", fill: config.color, fontWeight: "bold" }
                            }
                          }}
                          arc={{
                            colorArray: ["#22c55e", "#eab308", "#ef4444"],
                            subArcs: [{ limit: config.limits[0] }, { limit: config.limits[1] }, {}],
                            padding: 0.02,
                            width: 0.25
                          }}
                          pointer={{
                            elastic: true,
                            animationDelay: 100,
                            color: config.color
                          }}
                        />
                        <div className={`absolute inset-0 bg-${config.colorClass}-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graph Section */}
              {selectedGraph?.field === config.field && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F3F4F6'
                          }}
                        />
                        <Line type="monotone" dataKey={`X_${config.field}`} stroke="#ef4444" strokeWidth={2} name="X-Axis" />
                        <Line type="monotone" dataKey={`Y_${config.field}`} stroke="#22c55e" strokeWidth={2} name="Y-Axis" />
                        <Line type="monotone" dataKey={`Z_${config.field}`} stroke="#3b82f6" strokeWidth={2} name="Z-Axis" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MM_Feed_drive;
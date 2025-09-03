import React, { useState, useEffect, useRef, useCallback } from "react";
import GaugeComponent from "react-gauge-component";
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowLeftRight, Settings, Zap, Gauge, Activity, Power, ArrowUp, ArrowRight } from 'lucide-react';

// Enhanced error handler (same as before)
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

// Feed Drive Animation Component
const Lathe2AxisFeedDrive = ({ 
  xPosition = 150, 
  zPosition = 300,
  xSpeed = 1200, 
  zSpeed = 800,
  xTorque = 25.5, 
  zTorque = 18.2,
  xPower = 8.5, 
  zPower = 6.1,
  xLimits = { min: 50, max: 250 },
  zLimits = { min: 100, max: 500 }
}) => {
  const [isActive, setIsActive] = useState(true);
  
  // Normalize positions to percentages
  const xNormalizedPos = ((xPosition - xLimits.min) / (xLimits.max - xLimits.min)) * 100;
  const zNormalizedPos = ((zPosition - zLimits.min) / (zLimits.max - zLimits.min)) * 100;
  const xClampedPos = Math.max(0, Math.min(100, xNormalizedPos));
  const zClampedPos = Math.max(0, Math.min(100, zNormalizedPos));

  const AxisAnimation = ({ 
    axis, 
    position, 
    speed, 
    torque, 
    power, 
    limits, 
    normalizedPos,
    isVertical = false 
  }) => (
    <div className={`bg-gradient-to-br from-gray-900/95 via-black/90 to-slate-900/95 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl ${isVertical ? 'h-full' : 'mb-auto w-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
            {axis}-Axis Drive
          </h3>
          <div className={`flex items-center gap-2 text-gray-400 ${isVertical ? 'flex-col' : ''}`}>
            {isVertical ? <ArrowUp size={16} /> : <ArrowRight size={16} />}
            <span className="text-sm">{isVertical ? 'Vertical' : 'Horizontal'} Movement</span>
          </div>
        </div>
        
        {/* Position Display */}
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400 mb-1">
            {position.toFixed(2)} <span className="text-lg text-gray-400">mm</span>
          </div>
          <div className="text-sm text-gray-400">
            {normalizedPos.toFixed(1)}% travel
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${speed > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span>{speed > 0 ? 'Active' : 'Idle'}</span>
        </div>
        <div className="text-xs">
          Range: {limits.min} - {limits.max} mm
        </div>
        <div className="text-xs">
          Speed: {speed.toFixed(0)} mm/min
        </div>
      </div>

      {/* Animation Container */}
      <div className={`relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 mb-6 overflow-hidden ${isVertical ? 'h-96 w-72 mx-auto' : 'h-64'}`}>
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '15px 15px'
          }}></div>
        </div>

        {/* Scale Markers */}
        {isVertical ? (
          <>
            <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-blue-400/70">
              {[100, 75, 50, 25, 0].map((percent, index) => (
                <div key={percent} className="flex items-center gap-1">
                  <div className="h-px w-2 bg-blue-500/50"></div>
                  <span>{((limits.max - limits.min) * percent / 100 + limits.min).toFixed(0)}mm</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute top-2 left-8 right-8 flex justify-between text-xs text-blue-400/70">
              {[0, 25, 50, 75, 100].map(percent => (
                <div key={percent} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-blue-500/50"></div>
                  <span>{((limits.max - limits.min) * percent / 100 + limits.min).toFixed(0)}mm</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Guide Rails */}
        {isVertical ? (
          <>
            <div className="absolute left-16 top-8 bottom-8 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>
            <div className="absolute right-16 top-8 bottom-8 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>
          </>
        ) : (
          <>
            <div className="absolute top-16 left-8 right-8 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>
            <div className="absolute bottom-16 left-8 right-8 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>
          </>
        )}

        {/* Lead Screw/Ball Screw */}
        <div className={`absolute ${isVertical ? 'left-1/2 top-8 bottom-8 w-6 transform -translate-x-1/2' : 'top-1/2 left-8 right-8 h-6 transform -translate-y-1/2'}`}>
          <div className={`w-full h-full bg-gradient-to-${isVertical ? 'b' : 'r'} from-gray-400 via-gray-500 to-gray-600 rounded-full shadow-lg relative overflow-hidden`}>
            {/* Rotating Pattern */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `repeating-linear-gradient(
                  ${isVertical ? '0' : '90'}deg,
                  rgba(156, 163, 175, 0.3) 0px,
                  rgba(156, 163, 175, 0.3) 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                animation: speed > 0 ? 'scroll-pattern 1.5s linear infinite' : 'none'
              }}
            ></div>
            {/* Metallic Shine */}
            <div className={`absolute inset-0 bg-gradient-to-${isVertical ? 'b' : 'r'} from-white/30 via-transparent to-black/20 rounded-full`}></div>
          </div>
        </div>

        {/* Moving Carriage/Cross Slide */}
        <div
          className={`absolute transition-all duration-500 ease-out z-10 ${
            isVertical 
              ? 'left-1/2 w-16 h-20 transform -translate-x-1/2' 
              : 'top-1/2 h-16 w-20 transform -translate-y-1/2'
          }`}
          style={isVertical ? {
            top: `calc(2rem + ${(100 - normalizedPos) * (100 - 15) / 100}%)`
          } : {
            left: `calc(2rem + ${normalizedPos * (100 - 10) / 100}%)`
          }}
        >
          {/* Carriage Base */}
          <div className="w-full h-full bg-gradient-to-br from-blue-400/20 via-blue-500/30 to-blue-600/40 rounded-xl border border-blue-400/50 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Glowing Edge */}
            <div className="absolute inset-0 rounded-xl border-2 border-blue-400/60 animate-pulse"></div>

            {/* Surface Details */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-300/10 to-transparent rounded-lg"></div>
            
            {/* Mounting Points */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400/80 rounded-full shadow-lg"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400/80 rounded-full shadow-lg"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400/80 rounded-full shadow-lg"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-400/80 rounded-full shadow-lg"></div>

            {/* Center Mount */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-full border-2 border-gray-400 shadow-inner"></div>
            
            {/* Tool Post (for X-axis) */}
            {axis === 'X' && (
              <div className="absolute -right-2 top-1/2 w-3 h-8 transform -translate-y-1/2 bg-gradient-to-b from-orange-400 to-orange-600 rounded-sm border border-orange-500/50"></div>
            )}
          </div>

          {/* Position Label */}
          <div className={`absolute text-xs text-blue-400 font-bold bg-black/80 px-2 py-1 rounded whitespace-nowrap ${
            isVertical ? '-left-8 top-1/2 transform -translate-y-1/2' : '-top-8 left-1/2 transform -translate-x-1/2'
          }`}>
            {position.toFixed(1)}mm
          </div>
        </div>

        {/* Motor Section */}
        <div className={`absolute ${isVertical ? 'bottom-2 left-1/2 w-12 h-12 transform -translate-x-1/2' : 'top-1/2 left-2 w-12 h-12 transform -translate-y-1/2'}`}>
          {/* Motor Housing */}
          <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg border border-gray-600 relative shadow-xl">
            {/* Motor Face */}
            <div className="absolute inset-1 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>

            {/* Rotating Gear Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings
                className={`w-6 h-6 text-yellow-400 ${speed > 0 ? 'animate-spin' : ''}`}
                style={{ animationDuration: speed > 0 ? `${Math.max(0.5, 3 - (speed / 2000))}s` : 'none' }}
              />
            </div>

            {/* Power Indicator */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${power > 1 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>

        {/* Motion Trail */}
        {speed > 0 && (
          <div
            className={`absolute bg-gradient-to-${isVertical ? 'b' : 'r'} from-transparent via-blue-400/30 to-transparent transition-all duration-500 ${
              isVertical ? 'left-1/2 w-2 transform -translate-x-1/2' : 'top-1/2 h-2 transform -translate-y-1/2'
            }`}
            style={isVertical ? {
              top: `calc(2rem + ${(100 - normalizedPos) * (100 - 15) / 100}% - 40px)`,
              height: '80px',
              opacity: Math.min(1, speed / 1000)
            } : {
              left: `calc(2rem + ${normalizedPos * (100 - 10) / 100}% - 40px)`,
              width: '80px',
              opacity: Math.min(1, speed / 1000)
            }}
          ></div>
        )}
      </div>

      {/* Parameter Cards */}
      <div className="flex gap-3">
        {/* Torque */}
        <div className="flex-1 bg-black/80 rounded-lg p-3 border border-teal-500/50">
          <div className="flex items-center gap-2 text-xs text-teal-400 mb-1">
            <Gauge size={12} />
            <span>Torque</span>
          </div>
          <div className="text-sm text-white font-mono">{torque.toFixed(1)} Nm</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (torque / 50) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Power */}
        <div className="flex-1 bg-black/80 rounded-lg p-3 border border-pink-500/50">
          <div className="flex items-center gap-2 text-xs text-pink-400 mb-1">
            <Zap size={12} />
            <span>Power</span>
          </div>
          <div className="text-sm text-white font-mono">{power.toFixed(1)} kW</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
            <div
              className="h-full bg-pink-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (power / 15) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Speed */}
        <div className="flex-1 bg-black/80 rounded-lg p-3 border border-green-500/50">
          <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
            <Activity size={12} />
            <span>Speed</span>
          </div>
          <div className="text-sm text-white font-mono">{speed.toFixed(0)} mm/min</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (speed / 2000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-7xl mx-auto">
        {/* X-Axis (Cross Slide) */}
        <AxisAnimation
          axis="X"
          position={xPosition}
          speed={xSpeed}
          torque={xTorque}
          power={xPower}
          limits={xLimits}
          normalizedPos={xClampedPos}
          isVertical={false}
        />

        {/* Z-Axis (Carriage) */}
        <AxisAnimation
          axis="Z"
          position={zPosition}
          speed={zSpeed}
          torque={zTorque}
          power={zPower}
          limits={zLimits}
          normalizedPos={zClampedPos}
          isVertical={true}
        />
      </div>
      <div className="mt-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h3 className="text-blue-400 font-semibold mb-2">X-Axis (Radial)</h3>
            <p className="text-gray-400 text-sm">Controls cross slide movement for diameter machining operations</p>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h3 className="text-blue-400 font-semibold mb-2">Z-Axis (Longitudinal)</h3>
            <p className="text-gray-400 text-sm">Controls carriage movement parallel to spindle axis for length operations</p>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h3 className="text-blue-400 font-semibold mb-2">Precision Control</h3>
            <p className="text-gray-400 text-sm">Real-time monitoring of position, speed, torque, and power parameters</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scroll-pattern {
          0% { transform: translate(0, 0); }
          100% { transform: translate(8px, 8px); }
        }
        
        @keyframes rotate-pattern {
          0% { transform: translateX(0); }
          100% { transform: translateX(16px); }
        }
        
        @media (max-width: 768px) {
          .grid-cols-1.xl\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const Feed_drive = () => {
  const [data, setData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const unmountedRef = useRef(false);
  const fetchAttemptRef = useRef(0);

  const fetchData = useCallback(async () => {
    // Skip if component is unmounted
    if (unmountedRef.current) return;

    try {
      // Use realtime endpoint to get latest data efficiently
      const response = await fetch(`https://cmti-edge.online/M2C/Backend/OPCUA_FeedDrive.php?action=realtime&lastId=${lastId}&t=${Date.now()}`);
      const result = await response.json();

      if (!unmountedRef.current && result.status === "success") {
        if (result.hasNewData && Array.isArray(result.data)) {
          // Handle multiple new data points
          const latestData = result.data[0]; // Get the most recent data point
          setData(latestData);
          setLastId(latestData.id);

          // Add all new data points to historical data
          result.data.reverse().forEach(dataPoint => {
            const timestamp = new Date(dataPoint.timestamp);
            const newDataPoint = {
              timestamp: timestamp.toLocaleTimeString(),
              time: timestamp.getTime(), // Add numeric timestamp for sorting
              speed: parseFloat(dataPoint.speed) || 0,
              torque: parseFloat(dataPoint.torque) || 0,
              voltage: parseFloat(dataPoint.voltage) || 0,
              current: parseFloat(dataPoint.current) || 0,
              power: parseFloat(dataPoint.power) || 0,
              temperature: parseFloat(dataPoint.temperature) || 0,
              position: parseFloat(dataPoint.position) || 0
            };

            setHistoricalData(prev => {
              const updated = [...prev, newDataPoint];
              // Keep only last 20 data points for performance
              return updated.slice(-20);
            });
          });
        } else if (result.data && !result.hasNewData) {
          // No new data, but we have existing data
          const currentData = result.data;
          setData(prev => prev || currentData); // Only set if we don't have data

          // If this is our first data point, add it to historical data
          if (!data) {
            const timestamp = new Date(currentData.timestamp);
            const newDataPoint = {
              timestamp: timestamp.toLocaleTimeString(),
              time: timestamp.getTime(),
              speed: parseFloat(currentData.speed) || 0,
              torque: parseFloat(currentData.torque) || 0,
              voltage: parseFloat(currentData.voltage) || 0,
              current: parseFloat(currentData.current) || 0,
              power: parseFloat(currentData.power) || 0,
              temperature: parseFloat(currentData.temperature) || 0,
              position: parseFloat(currentData.position) || 0
            };

            setHistoricalData(prev => [...prev, newDataPoint]);
          }

          if (currentData.id > lastId) {
            setLastId(currentData.id);
          }
        }

        setConnectionStatus("connected");
        setInitialLoading(false);
        fetchAttemptRef.current = 0; // Reset attempt counter on success
      } else if (result.status === "error") {
        throw new Error(result.message || "API response unsuccessful");
      }
    } catch (err) {
      if (!unmountedRef.current) {
        console.error("Error:", err);

        // Only show disconnected status after multiple failed attempts
        if (fetchAttemptRef.current >= 2) {
          setConnectionStatus("disconnected");
        } else {
          fetchAttemptRef.current += 1;
          setConnectionStatus("reconnecting");
        }

        // Fallback to latest endpoint if realtime fails (only on initial load or when no data)
        if (!data) {
          try {
            const fallbackResponse = await fetch("https://cmti-edge.online/M2C/Backend/OPCUA_FeedDrive.php?action=latest");
            const fallbackResult = await fallbackResponse.json();

            if (fallbackResult.status === "success" && fallbackResult.data) {
              setData(fallbackResult.data);
              setLastId(fallbackResult.data.id);

              // Add initial data to historical data
              const timestamp = new Date(fallbackResult.data.timestamp);
              const newDataPoint = {
                timestamp: timestamp.toLocaleTimeString(),
                time: timestamp.getTime(),
                speed: parseFloat(fallbackResult.data.speed) || 0,
                torque: parseFloat(fallbackResult.data.torque) || 0,
                voltage: parseFloat(fallbackResult.data.voltage) || 0,
                current: parseFloat(fallbackResult.data.current) || 0,
                power: parseFloat(fallbackResult.data.power) || 0,
                temperature: parseFloat(fallbackResult.data.temperature) || 0,
                position: parseFloat(fallbackResult.data.position) || 0
              };

              setHistoricalData([newDataPoint]);
              setConnectionStatus("connected");
              setInitialLoading(false);
              fetchAttemptRef.current = 0;
            }
          } catch (fallbackErr) {
            console.error("Fallback error:", fallbackErr);
          }
        }
      }
    }
  }, [lastId, data]);

  useEffect(() => {
    unmountedRef.current = false;

    // Initial data fetch
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, 3000);

    return () => {
      unmountedRef.current = true;
      clearInterval(interval);
    };
  }, [fetchData]);

  const getValue = (field) => parseFloat(data?.[field]) || 0;

  const gaugeConfig = [
    { field: "speed", title: "Speed", unit: "RPM", color: "#22c55e", colorClass: "green", max: 10000, ticks: [2500, 5000, 7500, 10000], limits: [4000, 8000], decimals: 0 },
    { field: "torque", title: "Torque", unit: "Nm", color: "#14b8a6", colorClass: "teal", max: 50, ticks: [12.5, 25, 37.5, 50], limits: [20, 40], decimals: 1 },
    { field: "voltage", title: "Voltage", unit: "V", color: "#8b5cf6", colorClass: "purple", max: 480, ticks: [120, 240, 360, 480], limits: [192, 384], decimals: 1 },
    { field: "current", title: "Current", unit: "A", color: "#f59e0b", colorClass: "yellow", max: 20, ticks: [5, 10, 15, 20], limits: [8, 16], decimals: 1 },
    { field: "power", title: "Power", unit: "kW", color: "#ec4899", colorClass: "pink", max: 15, ticks: [3.75, 7.5, 11.25, 15], limits: [6, 12], decimals: 1 },
    { field: "temperature", title: "Temperature", unit: "°C", color: "#ef4444", colorClass: "red", max: 120, ticks: [30, 60, 90, 120], limits: [48, 96], decimals: 1 }
  ];

  const handleGraphClick = (config) => {
    setSelectedGraph(prev =>
      prev?.field === config.field ? null : config
    );
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500/30 rounded-full animate-spin border-t-green-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold animate-pulse">
            Initializing Feed Drive Monitoring System...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white" style={{ willChange: "contents" }}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[
          { pos: "-top-40 -right-40", color: "green-500/10", delay: "" },
          { pos: "-bottom-40 -left-40", color: "teal-500/10", delay: "animation-delay-1000" },
          { pos: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", color: "green-500/5", delay: "animation-delay-2000", size: "w-96 h-96" }
        ].map((bg, i) => (
          <div key={i} className={`absolute ${bg.pos} ${bg.size || "w-80 h-80"} bg-${bg.color} rounded-full blur-3xl animate-pulse ${bg.delay}`}
            style={{ willChange: "transform, opacity", transformStyle: "preserve-3d" }}></div>
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-4 mx-auto">
        {/* Feed Drive Animation - Main Feature */}
        <div className="mb-2 max-w-7xl mx-auto">
          <Lathe2AxisFeedDrive
            position={getValue("position")}
            speed={getValue("speed")}
            torque={getValue("torque")}
            power={getValue("power")}
            limits={{ min: 0, max: 700 }}
          />
        </div>

        {/* Gauges Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-7xl">
            {gaugeConfig.map((config, index) => {
              const value = getValue(config.field);
              const isSelected = selectedGraph?.field === config.field;

              return (
                <div key={config.field} className="text-center group bg-gradient-to-br from-black/95 via-gray-900/90 to-slate-900/95 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30 shadow-lg">
                  {/* Graph Icon */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleGraphClick(config)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isSelected
                        ? `bg-${config.colorClass}-500/20 text-${config.colorClass}-400`
                        : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'
                        }`}
                    >
                      <TrendingUp size={20} />
                    </button>
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
                          style: { fontSize: "20px", fill: config.color, fontWeight: "bold" }
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
                        animationDelay: index * 100,
                        color: config.color
                      }}
                    />
                    <div className={`absolute inset-0 bg-${config.colorClass}-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className={`font-semibold text-${config.colorClass}-400 text-lg mb-2`}>
                    {config.title}
                  </h3>
                  <p className="text-gray-300 text-md font-medium">
                    {value.toFixed(config.decimals)} {config.unit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graph Section */}
        {selectedGraph && (
          <div className="mb-8 bg-gradient-to-br from-black/95 via-gray-900/90 to-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold text-${selectedGraph.colorClass}-400`}>
                {selectedGraph.title} Trend
              </h2>
              <button
                onClick={() => setSelectedGraph(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl px-3 py-1 hover:bg-gray-700/50 rounded"
              >
                ×
              </button>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value) => [
                      `${parseFloat(value).toFixed(selectedGraph.decimals)} ${selectedGraph.unit}`,
                      selectedGraph.title
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedGraph.field}
                    stroke={selectedGraph.color}
                    strokeWidth={2}
                    dot={{ fill: selectedGraph.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: selectedGraph.color, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-400 text-center">
              Showing {historicalData.length} data points from live API
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed_drive;
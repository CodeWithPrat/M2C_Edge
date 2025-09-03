import React, { useState, useEffect, useRef, useCallback } from "react";
import GaugeComponent from "react-gauge-component";
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

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
    <div style={{width: "100%", height: "100%", position: "relative", overflow: "hidden", contain: "layout paint style", transform: "translateZ(0)"}}>
      <GaugeComponent value={displayValue} {...props} style={{width: "100%", height: "100%", contain: "content"}} />
    </div>
  );
};

const Spindle = () => {
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
      const response = await fetch(`https://cmti-edge.online/M2C/Backend/OPCUASpindle.php?action=realtime&lastId=${lastId}&t=${Date.now()}`);
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
              temperature: parseFloat(dataPoint.temperature) || 0
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
              temperature: parseFloat(currentData.temperature) || 0
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
            const fallbackResponse = await fetch("https://cmti-edge.online/M2C/Backend/OPCUASpindle.php?action=latest");
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
                temperature: parseFloat(fallbackResult.data.temperature) || 0
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

  // Generate some sample data if no historical data exists (for demonstration)
  const getSampleData = () => {
    if (historicalData.length > 0) return historicalData;
    
    // Generate sample data for demonstration
    const sampleData = [];
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(Date.now() - (9 - i) * 30000); // 30 seconds apart
      sampleData.push({
        timestamp: timestamp.toLocaleTimeString(),
        time: timestamp.getTime(),
        speed: Math.random() * 8000 + 1000,
        torque: Math.random() * 30 + 10,
        voltage: Math.random() * 100 + 300,
        current: Math.random() * 10 + 5,
        power: Math.random() * 8 + 4,
        temperature: Math.random() * 40 + 60
      });
    }
    return sampleData;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500/30 rounded-full animate-spin border-t-green-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold animate-pulse">
            Initializing Spindle Monitoring System...
          </div>
        </div>
      </div>
    );
  }

  const displayData = getSampleData();

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

      <div className="relative z-10 p-4 md:p-6 mx-auto">
        {/* Gauges Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-6xl">
            {gaugeConfig.map((config, index) => {
              const value = getValue(config.field);
              const isSelected = selectedGraph?.field === config.field;
              
              return (
                <div key={config.field} className="text-center group bg-gradient-to-br from-black/95 via-gray-900/90 to-slate-900/95 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30 shadow-lg">
                  {/* Graph Icon */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleGraphClick(config)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isSelected 
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
                <LineChart data={displayData}>
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
              {displayData === historicalData ? 
                `Showing ${displayData.length} real data points` :
                'Showing sample data - real data will appear as it becomes available'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spindle;
import React, { useState, useEffect } from 'react';
import { Thermometer, RefreshCw, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ThermometerDisplay = ({ value, label, type, unit = "°C", index, onGraphClick }) => {
  const maxTemp = 100;
  const minTemp = 0;
  const percentage = ((value - minTemp) / (maxTemp - minTemp)) * 100;
  
  const getTemperatureColor = (temp) => {
    if (temp < 20) return "from-blue-300 via-blue-400 to-blue-500";
    if (temp < 40) return "from-green-300 via-green-400 to-green-500";
    if (temp < 60) return "from-yellow-300 via-yellow-400 to-yellow-500";
    if (temp < 80) return "from-orange-300 via-orange-400 to-orange-500";
    return "from-red-300 via-red-400 to-red-500";
  };

  const getTemperatureStatus = (temp) => {
    if (temp < 20) return "Cool";
    if (temp < 40) return "Optimal";
    if (temp < 60) return "Warm";
    if (temp < 80) return "Hot";
    return "Critical";
  };

  return (
    <div 
      className=" w-full sm:w-80 md:w-96 lg:w-[420px] group relative bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-xl">
            <Thermometer className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{label}</h3>
            <p className="text-gray-400 text-sm">{type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-right">
          <div className="text-right">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              {value}{unit}
            </p>
            <p className={`text-xs font-semibold ${
              getTemperatureStatus(value) === 'Critical' ? 'text-red-400' :
              getTemperatureStatus(value) === 'Hot' ? 'text-orange-400' :
              getTemperatureStatus(value) === 'Warm' ? 'text-yellow-400' :
              getTemperatureStatus(value) === 'Optimal' ? 'text-green-400' :
              'text-blue-400'
            }`}>
              {getTemperatureStatus(value)}
            </p>
          </div>
          <button
            onClick={onGraphClick}
            className="p-2 bg-gradient-to-r from-blue-600/30 to-blue-700/30 rounded-xl hover:from-blue-500/40 hover:to-blue-600/40 transition-all duration-300 group/btn"
          >
            <TrendingUp className="w-5 h-5 text-blue-300 group-hover/btn:text-blue-200 transition-colors duration-300" />
          </button>
        </div>
      </div>
      
      {/* Realistic Thermometer */}
      <div className="relative flex items-center justify-center">
        <div className="relative">
          {/* Thermometer Body - More realistic shape */}
          <div className="relative flex flex-col items-center">
            {/* Top rounded section */}
            <div className="w-8 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full border-2 border-gray-500 mb-1"></div>
            
            {/* Main tube */}
            <div className="w-6 h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm relative overflow-hidden border-2 border-gray-500 shadow-inner">
              {/* Inner tube (where mercury/alcohol goes) */}
              <div className="absolute inset-1 bg-gradient-to-b from-gray-50 to-white rounded-sm overflow-hidden">
                {/* Temperature Fill - Mercury/Alcohol effect */}
                <div 
                  className={`absolute bottom-0 w-full bg-gradient-to-t ${getTemperatureColor(value)} rounded-sm transition-all duration-1000 ease-out`}
                  style={{ 
                    height: `${Math.max(percentage, 8)}%`,
                    boxShadow: `inset 0 0 10px rgba(0,0,0,0.3), 0 0 20px ${
                      value < 20 ? 'rgba(59, 130, 246, 0.6)' :
                      value < 40 ? 'rgba(34, 197, 94, 0.6)' :
                      value < 60 ? 'rgba(234, 179, 8, 0.6)' :
                      value < 80 ? 'rgba(249, 115, 22, 0.6)' :
                      'rgba(239, 68, 68, 0.6)'
                    }`
                  }}
                >
                  {/* Mercury shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Bulb at bottom */}
            <div className={`w-14 h-14 bg-gradient-to-br ${getTemperatureColor(value)} rounded-full border-3 border-gray-500 shadow-2xl relative -mt-1`}>
              {/* Bulb reflection */}
              <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
              {/* Bulb shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-full"></div>
            </div>
          </div>
          
          {/* Temperature Scale - More realistic positioning */}
          <div className="absolute left-12 top-2 h-40 flex flex-col justify-between text-xs text-gray-400">
            {[100, 80, 60, 40, 20, 0].map((temp, idx) => (
              <div key={temp} className="flex items-center">
                <div className="w-3 h-px bg-gray-500 mr-2"></div>
                <span className="font-mono text-gray-300">{temp}°C</span>
              </div>
            ))}
          </div>
          
          {/* Scale markings on the left side */}
          <div className="absolute -left-2 top-2 h-40 flex flex-col justify-between">
            {[100, 80, 60, 40, 20, 0].map((temp, idx) => (
              <div key={temp} className="w-2 h-px bg-gray-500"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TemperatureGraph = ({ sensorData, sensorName, onClose }) => {
  const getLineColor = (temp) => {
    if (temp < 20) return "#3b82f6";
    if (temp < 40) return "#22c55e";
    if (temp < 60) return "#eab308";
    if (temp < 80) return "#f97316";
    return "#ef4444";
  };

  const avgTemp = sensorData.reduce((sum, item) => sum + item.temperature, 0) / sensorData.length;

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600/30 to-blue-700/30 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">{sensorName} Temperature Graph</h3>
            <p className="text-gray-400 text-sm">Real-time temperature monitoring over time</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300 text-xl font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensorData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#ffffff'
              }}
              formatter={(value) => [`${value}°C`, 'Temperature']}
              labelFormatter={(value) => `Time: ${new Date(value).toLocaleTimeString()}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke={getLineColor(avgTemp)}
              strokeWidth={3}
              dot={{ fill: getLineColor(avgTemp), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getLineColor(avgTemp), strokeWidth: 2 }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Current</p>
          <p className="text-white font-bold text-lg">{sensorData[sensorData.length - 1]?.temperature}°C</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Average</p>
          <p className="text-white font-bold text-lg">{avgTemp.toFixed(1)}°C</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Max</p>
          <p className="text-white font-bold text-lg">{Math.max(...sensorData.map(d => d.temperature))}°C</p>
        </div>
      </div>
    </div>
  );
};

const Modbus = () => {
  const [temperatures, setTemperatures] = useState({
    rtd1: 25,
    rtd2: 30,
    rtd3: 35
  });
  
  const [temperatureHistory, setTemperatureHistory] = useState({
    rtd1: [],
    rtd2: [],
    rtd3: []
  });
  
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateRandomTemperature = (currentTemp) => {
    // Generate temperature with some variance (-5 to +5 degrees from current)
    const variance = (Math.random() - 0.5) * 10;
    let newTemp = currentTemp + variance;
    
    // Keep temperature within reasonable bounds (10-95°C)
    newTemp = Math.max(10, Math.min(95, newTemp));
    
    return Math.round(newTemp * 10) / 10; // Round to 1 decimal place
  };

  const updateTemperatures = () => {
    const currentTime = new Date();
    
    setTemperatures(prev => {
      const newTemps = {
        rtd1: generateRandomTemperature(prev.rtd1),
        rtd2: generateRandomTemperature(prev.rtd2),
        rtd3: generateRandomTemperature(prev.rtd3)
      };
      
      // Update temperature history
      setTemperatureHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        
        Object.keys(newTemps).forEach(sensor => {
          newHistory[sensor] = [
            ...prevHistory[sensor],
            {
              time: currentTime.toISOString(),
              temperature: newTemps[sensor]
            }
          ].slice(-20); // Keep last 20 readings
        });
        
        return newHistory;
      });
      
      setLastUpdate(currentTime);
      return newTemps;
    });
  };

  useEffect(() => {
    // Initialize temperature history
    const currentTime = new Date();
    const initialHistory = {};
    
    Object.keys(temperatures).forEach(sensor => {
      initialHistory[sensor] = [{
        time: currentTime.toISOString(),
        temperature: temperatures[sensor]
      }];
    });
    
    setTemperatureHistory(initialHistory);
    
    // Update temperatures every 3 seconds
    const interval = setInterval(updateTemperatures, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGraphClick = (sensor) => {
    setSelectedGraph({ sensor, data: temperatureHistory[sensor] });
  };

  const getSensorName = (sensor) => {
    const names = {
      rtd1: 'Temperature Sensor 1',
      rtd2: 'Temperature Sensor 2',
      rtd3: 'Temperature Sensor 3'
    };
    return names[sensor];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-gray-400 to-gray-600 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-start mb-10">
            <div className="flex items-start justify-start mb-2">
              <div className="w-2 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mr-4"></div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">MODBUS TCP/IP Temperature Monitoring</h2>
                <p className="text-gray-400 text-lg">Resistance temperature detectors</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm ml-6">Last updated: {lastUpdate.toLocaleTimeString()}</p>
          </div>

          {/* Centered Temperature Cards */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
              <ThermometerDisplay 
                value={temperatures.rtd1} 
                label="Temperature Sensor 1" 
                type="RTD Sensor"
                index={0} 
                onGraphClick={() => handleGraphClick('rtd1')}
              />
              <ThermometerDisplay 
                value={temperatures.rtd2} 
                label="Temperature Sensor 2" 
                type="RTD Sensor"
                index={1} 
                onGraphClick={() => handleGraphClick('rtd2')}
              />
              <ThermometerDisplay 
                value={temperatures.rtd3} 
                label="Temperature Sensor 3" 
                type="RTD Sensor"
                index={2} 
                onGraphClick={() => handleGraphClick('rtd3')}
              />
            </div>
          </div>

          {/* Temperature Graph */}
          {selectedGraph && (
            <div className="max-w-6xl mx-auto">
              <TemperatureGraph 
                sensorData={selectedGraph.data}
                sensorName={getSensorName(selectedGraph.sensor)}
                onClose={() => setSelectedGraph(null)}
              />
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Modbus;
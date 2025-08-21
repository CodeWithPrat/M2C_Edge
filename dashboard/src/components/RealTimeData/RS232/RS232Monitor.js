import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Cpu, WifiOff } from 'lucide-react';

const RS232Monitor = () => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [dataRate, setDataRate] = useState(9600);
  const intervalRef = useRef(null);
  const timeRef = useRef(0);
  const lastValueRef = useRef(5); // Start with high value

  // Generate proper square wave data
  const generateSquareWave = () => {
    const frequency = 0.5; // Lower frequency for cleaner visualization
    const amplitude = 5; // Volts
    const currentTime = timeRef.current;
    
    // Calculate which half of the cycle we're in
    const cyclePosition = (currentTime * frequency) % 1;
    const value = cyclePosition < 0.5 ? amplitude : -amplitude;
    
    // Only add a point when the value changes
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;
      return {
        time: currentTime.toFixed(1),
        voltage: value,
        displayTime: new Date().toLocaleTimeString()
      };
    }
    
    return null;
  };

  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        const newPoint = generateSquareWave();
        
        if (newPoint) {
          setData(prevData => {
            const newData = [...prevData, newPoint];
            // Keep only last 50 points for performance
            return newData.slice(-50);
          });
        }
        
        timeRef.current += 0.1;
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      // Reset time when reconnecting
      timeRef.current = 0;
      lastValueRef.current = 5;
      setData([]);
    }
  };

  const currentVoltage = data.length > 0 ? data[data.length - 1].voltage : 0;
  const signalStrength = Math.abs(currentVoltage) / 5 * 100;

  // Prepare data for chart with proper square wave representation
  const chartData = data.map((point, index) => {
    // For square wave, we need to add an intermediate point right after transition
    // to create the vertical line effect
    if (index > 0) {
      const prevPoint = data[index - 1];
      if (prevPoint.voltage !== point.voltage) {
        // Add an intermediate point with the same time but new voltage
        return [
          { ...prevPoint, time: point.time }, // End of previous segment
          point // Start of new segment
        ];
      }
    }
    return point;
  }).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="border-b border-gray-700 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RS232 Monitor
                </h1>
                <p className="text-gray-400">Real-time Serial Data Visualization</p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isConnected 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isConnected ? <Activity className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span className="font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <button
                onClick={toggleConnection}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isConnected
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Current Voltage</p>
                <p className="text-2xl font-bold text-white">{currentVoltage.toFixed(1)}V</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Signal Strength</p>
                <p className="text-2xl font-bold text-white">{signalStrength.toFixed(0)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div>
              <p className="text-gray-400 text-sm">Baud Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{dataRate.toLocaleString()}</p>
                <select 
                  value={dataRate} 
                  onChange={(e) => setDataRate(Number(e.target.value))}
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                >
                  <option value={9600}>9600</option>
                  <option value={19200}>19200</option>
                  <option value={38400}>38400</option>
                  <option value={115200}>115200</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div>
              <p className="text-gray-400 text-sm">Data Points</p>
              <p className="text-2xl font-bold text-white">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Square Wave Signal</h2>
              <p className="text-gray-400">Real-time RS232 data visualization</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Voltage Signal</span>
              </div>
              <div className="text-gray-400">
                {data.length > 0 && `Last: ${data[data.length - 1]?.displayTime}`}
              </div>
            </div>
          </div>
          
          <div className="h-80 lg:h-96">
            {isConnected ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#374151" 
                    strokeOpacity={0.3}
                  />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `${value}s`}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `${value}V`}
                    domain={[-6, 6]}
                  />
                  <Line 
                    type="stepAfter"
                    dataKey="voltage" 
                    stroke="#60A5FA" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ 
                      r: 4, 
                      fill: '#60A5FA',
                      stroke: '#1E40AF',
                      strokeWidth: 2
                    }}
                    isAnimationActive={false} // Disable animation for cleaner rendering
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <WifiOff className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    Connection Disabled
                  </h3>
                  <p className="text-gray-500">
                    Click Connect to start monitoring RS232 data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            RS232 Serial Communication Monitor • Square Wave Generator • Real-time Data Visualization
          </p>
        </div>
      </div>
    </div>
  );
};

export default RS232Monitor;
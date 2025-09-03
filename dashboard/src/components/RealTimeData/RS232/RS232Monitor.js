import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Cpu, WifiOff } from 'lucide-react';

const RS232Monitor = () => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [dataRate, setDataRate] = useState(9600);
  const [currentStats, setCurrentStats] = useState({
    voltage: 0,
    signalStrength: 0,
    lastUpdate: null,
    totalRecords: 0
  });
  
  const intervalRef = useRef(null);
  const lastIdRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const baseAPI = 'https://cmti-edge.online/M2C/Backend/RS232.php';

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${baseAPI}?action=latest&limit=50`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        const formattedData = result.data.reverse().map((item, index) => ({
          id: item.id,
          time: index,
          voltage: item.data,
          timestamp: item.timestamp,
          displayTime: new Date(item.timestamp).toLocaleTimeString()
        }));
        
        setData(formattedData);
        lastIdRef.current = Math.max(...result.data.map(d => d.id));
        
        // Update current stats
        const latestData = result.data[result.data.length - 1];
        setCurrentStats(prev => ({
          ...prev,
          voltage: latestData.data,
          signalStrength: Math.abs(latestData.data) / 5 * 100,
          lastUpdate: new Date(latestData.timestamp),
          totalRecords: result.data.length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  // Fetch new data since last known ID
  const fetchRealtimeData = async () => {
    try {
      const response = await fetch(baseAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'realtime',
          last_id: lastIdRef.current
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        const newPoints = result.data.map((item, index) => ({
          id: item.id,
          time: Date.now() + index, // Use timestamp for unique time values
          voltage: item.data,
          timestamp: item.timestamp,
          displayTime: new Date(item.timestamp).toLocaleTimeString()
        }));
        
        setData(prevData => {
          const updatedData = [...prevData, ...newPoints];
          // Keep only last 100 points for performance
          const trimmedData = updatedData.slice(-100);
          
          // Update time values to be sequential
          return trimmedData.map((point, index) => ({
            ...point,
            time: index
          }));
        });
        
        // Update lastId to the highest received
        lastIdRef.current = Math.max(...result.data.map(d => d.id));
        
        // Update current stats with latest data
        const latestData = result.data[result.data.length - 1];
        setCurrentStats(prev => ({
          ...prev,
          voltage: latestData.data,
          signalStrength: Math.abs(latestData.data) / 5 * 100,
          lastUpdate: new Date(latestData.timestamp),
          totalRecords: prev.totalRecords + result.data.length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  };

  // Initialize data and start real-time updates
  useEffect(() => {
    if (isConnected) {
      // Load initial data only once
      if (isInitialLoadRef.current) {
        fetchInitialData();
        isInitialLoadRef.current = false;
      }
      
      // Start real-time polling
      intervalRef.current = setInterval(() => {
        fetchRealtimeData();
      }, 1000); // Poll every second
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  // Toggle connection
  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      // Reset and reload data when reconnecting
      setData([]);
      lastIdRef.current = 0;
      isInitialLoadRef.current = true;
      setCurrentStats({
        voltage: 0,
        signalStrength: 0,
        lastUpdate: null,
        totalRecords: 0
      });
    }
  };

  // Calculate min/max for Y-axis domain
  const voltageValues = data.map(d => d.voltage).filter(v => !isNaN(v));
  const minVoltage = voltageValues.length > 0 ? Math.min(...voltageValues) : -5;
  const maxVoltage = voltageValues.length > 0 ? Math.max(...voltageValues) : 5;
  const yAxisPadding = Math.max(1, (maxVoltage - minVoltage) * 0.1);
  const yAxisDomain = [
    Math.floor(minVoltage - yAxisPadding), 
    Math.ceil(maxVoltage + yAxisPadding)
  ];

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
                  {isConnected ? 'Live' : 'Disconnected'}
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
        {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Current Voltage</p>
                <p className="text-2xl font-bold text-white">
                  {currentStats.voltage.toFixed(2)}V
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Signal Strength</p>
                <p className="text-2xl font-bold text-white">
                  {currentStats.signalStrength.toFixed(0)}%
                </p>
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
              <p className="text-xs text-gray-500 mt-1">
                Total: {currentStats.totalRecords.toLocaleString()}
              </p>
            </div>
          </div>
        </div> */}

        {/* Graph Container */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">RS232 Data Stream</h2>
              <p className="text-gray-400">Real-time voltage measurements</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Voltage Signal</span>
              </div>
              {currentStats.lastUpdate && (
                <div className="text-gray-400">
                  Last: {currentStats.lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="h-80 lg:h-96">
            {isConnected ? (
              data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      strokeOpacity={0.3}
                    />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value, index) => {
                        // Show only a few ticks to avoid crowding
                        if (index % Math.ceil(data.length / 8) === 0) {
                          return `${value}`;
                        }
                        return '';
                      }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => `${value}V`}
                      domain={yAxisDomain}
                    />
                    <Line 
                      type="monotone"
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
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      Initializing Connection
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Establishing connection to RS232 data stream...
                    </p>
                  </div>
                </div>
              )
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
        
        {/* Connection Info */}
        {isConnected && (
          <div className="mt-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-6">
                <span>API: cmti-edge.online</span>
                <span>Update Rate: 1s</span>
                <span>Buffer: {data.length}/100 points</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data Stream</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            RS232 Serial Communication Monitor • Real-time Database Integration • Live Data Visualization
          </p>
        </div>
      </div>
    </div>
  );
};

export default RS232Monitor;
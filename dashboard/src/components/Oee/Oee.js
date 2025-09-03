import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Settings, Zap, Target, Info, Calculator, Lightbulb, Gauge, Activity, Wrench, Cog, AlertOctagon, TrendingDown, RefreshCw, Plus, Database } from 'lucide-react';

const RadialChart = ({ value, size = 120, strokeWidth = 8, color, label, sublabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center group">
      <div className="relative transition-transform duration-300 group-hover:scale-110" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
            style={{
              filter: `drop-shadow(0 0 12px ${color}60)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl xl:text-3xl font-bold text-white">{value ? value.toFixed(1) : 0}%</span>
          <span className="text-xs text-gray-400">{sublabel}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-300 mt-3 text-center">{label}</span>
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend, isLarge = false }) => (
  <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm ${isLarge ? 'col-span-2' : ''}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl ${color.replace('bg-', 'bg-')} bg-opacity-20 border border-opacity-30 ${color.replace('bg-', 'border-')}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="font-semibold text-gray-200">{title}</h3>
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${trend > 0 ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="text-3xl font-bold text-white">{value || '0'}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  </div>
);

const CalculationCard = ({ title, formula, calculation, result, unit }) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
    <h4 className="font-semibold text-gray-200 mb-4 flex items-center">
      <Calculator className="w-5 h-5 mr-2 text-blue-400" />
      {title}
    </h4>
    <div className="space-y-4">
      <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-600/30">
        <div className="text-sm text-gray-400 mb-2">Formula:</div>
        <div className="font-mono text-blue-400 text-sm">{formula}</div>
      </div>
      <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-600/30">
        <div className="text-sm text-gray-400 mb-2">Calculation:</div>
        <div className="font-mono text-green-400 text-sm">{calculation}</div>
      </div>
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
        <div className="text-sm text-gray-300 mb-2">Result:</div>
        <div className="text-2xl font-bold text-white">{result} {unit}</div>
      </div>
    </div>
  </div>
);

const RecommendationCard = ({ icon: Icon, title, description, priority, impact }) => {
  const priorityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-blue-400" />
          <h4 className="font-semibold text-gray-200">{title}</h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs border ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <p className="text-gray-400 mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">Impact: {impact}</span>
        </div>
      </div>
    </div>
  );
};

const OEELossAnalysis = ({ oee, availability, performance, quality }) => {
  const getMajorLosses = () => {
    const losses = [];
    
    if (availability < 85) {
      const lossPercent = 100 - availability;
      if (lossPercent > 10) {
        losses.push({
          type: 'Equipment Failure (Breakdowns)',
          description: 'Unplanned stops due to equipment breakdowns or failures',
          percentage: `${Math.round(lossPercent * 0.6)}-${Math.round(lossPercent * 0.8)}%`,
          solution: 'Implement preventive maintenance, improve spare parts management, train operators on basic troubleshooting',
          icon: AlertOctagon,
          color: 'text-red-400'
        });
      } else {
        losses.push({
          type: 'Setup and Adjustments',
          description: 'Planned stops for setup, changeovers, tooling adjustments',
          percentage: `${Math.round(lossPercent * 0.7)}-${Math.round(lossPercent * 0.9)}%`,
          solution: 'Implement SMED (Single Minute Exchange of Die) techniques, standardize setup procedures',
          icon: Cog,
          color: 'text-orange-400'
        });
      }
    }
    
    if (performance < 85) {
      const lossPercent = 100 - performance;
      if (lossPercent > 15) {
        losses.push({
          type: 'Reduced Speed',
          description: 'Running slower than the ideal cycle time',
          percentage: `${Math.round(lossPercent * 0.5)}-${Math.round(lossPercent * 0.7)}%`,
          solution: 'Optimize machine parameters, check for mechanical wear, review standard operating procedures',
          icon: TrendingDown,
          color: 'text-yellow-400'
        });
      } else {
        losses.push({
          type: 'Idling and Minor Stops',
          description: 'Short stops (less than 10 minutes), machine idling, jams',
          percentage: `${Math.round(lossPercent * 0.6)}-${Math.round(lossPercent * 0.8)}%`,
          solution: 'Implement root cause analysis for frequent stops, improve material flow, operator training',
          icon: Clock,
          color: 'text-blue-400'
        });
      }
    }
    
    if (quality < 95) {
      const lossPercent = 100 - quality;
      if (lossPercent > 8) {
        losses.push({
          type: 'Process Defects (Scrap/Rework)',
          description: 'Defects produced during steady-state production',
          percentage: `${Math.round(lossPercent * 0.7)}-${Math.round(lossPercent * 0.9)}%`,
          solution: 'Improve process control, implement statistical process control (SPC), operator quality training',
          icon: AlertTriangle,
          color: 'text-purple-400'
        });
      } else {
        losses.push({
          type: 'Reduced Yield (Startup Losses)',
          description: 'Defects during startup, warm-up, or after changeovers',
          percentage: `${Math.round(lossPercent * 0.5)}-${Math.round(lossPercent * 0.7)}%`,
          solution: 'Optimize startup procedures, implement warm-up cycles, standardize changeover processes',
          icon: Wrench,
          color: 'text-green-400'
        });
      }
    }
    
    return losses;
  };

  const majorLosses = getMajorLosses();
  const oeeStatus = oee >= 85 ? 'World Class' : 
                   oee >= 70 ? 'Good' : 
                   oee >= 60 ? 'Fair' : 'Poor';

  const statusColors = {
    'World Class': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Good': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Fair': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Poor': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <AlertTriangle className="w-7 h-7 mr-3 text-red-400" />
        OEE Loss Analysis & Root Cause
      </h3>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg text-gray-300">Current OEE Status:</span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[oeeStatus]}`}>
            {oeeStatus} (OEE: {oee}%)
          </span>
        </div>
        
        <div className="relative w-full bg-gray-800/80 rounded-full h-6 mb-3 border border-gray-600/30">
          <div 
            className="h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500 transition-all duration-1000 ease-in-out relative overflow-hidden" 
            style={{ width: `${oee}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-white drop-shadow-lg">{oee}%</span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>0% (Critical)</span>
          <span>60% (Acceptable)</span>
          <span>85% (World Class)</span>
          <span>100% (Perfect)</span>
        </div>
      </div>

      {majorLosses.length > 0 ? (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-red-400 flex items-center">
            <AlertOctagon className="w-6 h-6 mr-2" />
            Major Loss Areas Identified:
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {majorLosses.map((loss, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <loss.icon className={`w-6 h-6 ${loss.color}`} />
                    <h5 className="font-semibold text-white text-lg">{loss.type}</h5>
                  </div>
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/30">
                    {loss.percentage} loss
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{loss.description}</p>
                
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                  <p className="text-green-300">
                    <span className="font-semibold text-green-400">Solution:</span> {loss.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-green-400 mb-3">Exceptional Performance!</h4>
          <p className="text-gray-300 text-lg leading-relaxed">
            No major loss areas identified. Your equipment is operating at peak efficiency. 
            Continue monitoring and focus on continuous improvement to sustain this excellent performance.
          </p>
        </div>
      )}
    </div>
  );
};

const CreateOEEModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    runtime: '',
    machining_time: '',
    downtime: '',
    production_time: '',
    total_parts: '',
    good_parts: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      runtime: parseFloat(formData.runtime),
      machining_time: parseFloat(formData.machining_time),
      downtime: parseFloat(formData.downtime),
      production_time: parseFloat(formData.production_time),
      total_parts: parseInt(formData.total_parts),
      good_parts: parseInt(formData.good_parts)
    };
    onSubmit(data);
    setFormData({
      runtime: '',
      machining_time: '',
      downtime: '',
      production_time: '',
      total_parts: '',
      good_parts: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Plus className="w-6 h-6 mr-3 text-blue-400" />
          Create New OEE Record
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Runtime (seconds)</label>
            <input
              type="number"
              value={formData.runtime}
              onChange={(e) => setFormData({...formData, runtime: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Machining Time (seconds)</label>
            <input
              type="number"
              value={formData.machining_time}
              onChange={(e) => setFormData({...formData, machining_time: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Downtime (seconds)</label>
            <input
              type="number"
              value={formData.downtime}
              onChange={(e) => setFormData({...formData, downtime: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Production Time (seconds)</label>
            <input
              type="number"
              value={formData.production_time}
              onChange={(e) => setFormData({...formData, production_time: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Total Parts</label>
            <input
              type="number"
              value={formData.total_parts}
              onChange={(e) => setFormData({...formData, total_parts: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Good Parts</label>
            <input
              type="number"
              value={formData.good_parts}
              onChange={(e) => setFormData({...formData, good_parts: e.target.value})}
              className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl py-3 transition-all duration-300 font-semibold"
            >
              {loading ? 'Creating...' : 'Create OEE Record'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-3 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Oee = () => {
  const [oeeData, setOeeData] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchOeeData();
  }, []);

  const fetchOeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all OEE records with limit=1 to get the latest
      const response = await fetch('https://cmti-edge.online/M2C/Backend/Oee.php?limit=1&order_by=created_at&order_dir=DESC');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.error || 'Unknown error'}`);
      }
      
      if (result.success && result.data && result.data.length > 0) {
        setOeeData(result.data[0]); // Get the latest record
        setAllRecords(result.data);
      } else {
        setError('No OEE data available');
        setOeeData(null);
      }
    } catch (err) {
      setError(`Failed to fetch OEE data: ${err.message}`);
      setOeeData(null);
      console.error('Error fetching OEE data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOeeRecord = async (data) => {
    try {
      setCreateLoading(true);
      
      const response = await fetch('https://cmti-edge.online/M2C/Backend/Oee.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      if (result.success) {
        setOeeData(result.data);
        setIsModalOpen(false);
        // Refresh the data to get updated records
        fetchOeeData();
      } else {
        throw new Error(result.error || 'Failed to create OEE record');
      }
    } catch (err) {
      alert(`Error creating OEE record: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-800"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 absolute top-0 left-0"></div>
            <Gauge className="w-12 h-12 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading OEE Dashboard</h2>
          <p className="text-gray-400">Fetching real-time performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={fetchOeeData}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg"
            >
              Retry Connection
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!oeeData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Database className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No OEE Data</h2>
          <p className="text-gray-400 mb-6">No OEE records found. Create your first record to get started.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create First Record
          </button>
        </div>
      </div>
    );
  }

  // Parse the data from the backend response
  const availability = parseFloat(oeeData.availability) || 0;
  const performance = parseFloat(oeeData.performance) || 0;
  const quality = parseFloat(oeeData.quality) || 0;
  const oeePercentage = parseFloat(oeeData.oee_percentage) || 0;
  const oeeLoss = parseFloat(oeeData.oee_loss) || 0;

  // Convert data from database
  const runtimeMins = parseFloat(oeeData.runtime_mins) || 0;
  const downtimeMins = parseFloat(oeeData.downtime_sec) / 60 || 0;
  const productionTimeMins = parseFloat(oeeData.production_time_sec) / 60 || 0;
  const machiningTimeMins = parseFloat(oeeData.machining_time_sec) / 60 || 0;
  const totalParts = parseInt(oeeData.total_parts) || 0;
  const goodParts = parseInt(oeeData.good_parts) || 0;
  const targetParts = parseInt(oeeData.target_parts) || 0;
  const cycleTimeMins = parseFloat(oeeData.cycle_time_mins) || 0;

  // Advanced calculations
  const plannedProductionTime = runtimeMins - downtimeMins;
  const actualCycleTime = totalParts > 0 ? machiningTimeMins / totalParts : 0;
  const idealCycleTime = targetParts > 0 ? cycleTimeMins / targetParts : 0;
  const throughput = runtimeMins > 0 ? totalParts / (runtimeMins / 60) : 0;
  const firstPassYield = totalParts > 0 ? (goodParts / totalParts) * 100 : 0;
  const rejectedParts = totalParts - goodParts;
  const scrapRate = totalParts > 0 ? (rejectedParts / totalParts) * 100 : 0;

  // Loss calculations
  const availabilityLoss = 100 - availability;
  const performanceLoss = 100 - performance;
  const qualityLoss = 100 - quality;

  const recommendations = [
    {
      icon: Settings,
      title: "Reduce Machine Downtime",
      description: `Current downtime is ${downtimeMins.toFixed(1)} minutes. Implement preventive maintenance schedules to reduce unplanned stops and improve overall equipment availability.`,
      priority: "High",
      impact: "15-25% OEE improvement"
    },
    {
      icon: Zap,
      title: "Optimize Performance Rate",
      description: `Performance is at ${performance.toFixed(1)}%. Focus on operator training and equipment optimization to reach ideal cycle times and maximize throughput.`,
      priority: "High",
      impact: "10-20% OEE improvement"
    },
    {
      icon: CheckCircle,
      title: "Improve Quality Control",
      description: `Quality rate is ${quality.toFixed(1)}%. Implement real-time quality monitoring and process control measures to reduce defects and rework.`,
      priority: "High",
      impact: "5-15% OEE improvement"
    },
    {
      icon: Activity,
      title: "Implement Real-time Monitoring",
      description: "Deploy IoT sensors and real-time dashboards to identify issues immediately and reduce response times for faster problem resolution.",
      priority: "Medium",
      impact: "5-10% OEE improvement"
    },
    {
      icon: Target,
      title: "Operator Training Program",
      description: "Regular training programs can significantly improve machine operation efficiency and reduce human errors that lead to quality and performance issues.",
      priority: "Medium",
      impact: "8-12% OEE improvement"
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Decision Making",
      description: "Use historical OEE data to identify patterns and make informed decisions about production optimization and resource allocation.",
      priority: "Low",
      impact: "3-8% OEE improvement"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900 opacity-50"></div>
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Create OEE Modal */}
      <CreateOEEModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createOeeRecord}
        loading={createLoading}
      />

      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl">
                <Gauge className="w-10 h-10" />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  OEE Analytics Dashboard
                </h1>
                <p className="text-gray-400 text-lg">Real-time Overall Equipment Effectiveness Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center lg:text-right">
                <div className="text-lg font-semibold text-white">Record ID: #{oeeData.id}</div>
                <div className="text-sm text-gray-400">Last Updated: {new Date(oeeData.created_at).toLocaleString()}</div>
              </div>
              <button
                onClick={fetchOeeData}
                className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all duration-300 shadow-lg"
                title="Refresh Data"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-lg"
                title="Create New Record"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-8 space-y-12">
        {/* Key Performance Indicators */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Key Performance Indicators
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Clock}
              title="Runtime"
              value={`${(runtimeMins / 60).toFixed(1)}h`}
              subtitle={`${runtimeMins.toFixed(1)} minutes total`}
              color="bg-blue-500"
            />
            <MetricCard
              icon={Activity}
              title="Throughput"
              value={`${throughput.toFixed(1)}`}
              subtitle="parts per hour"
              color="bg-green-500"
            />
            <MetricCard
              icon={AlertTriangle}
              title="Downtime"
              value={`${(downtimeMins / 60).toFixed(1)}h`}
              subtitle={`${downtimeMins.toFixed(1)} minutes lost`}
              color="bg-red-500"
            />
            <MetricCard
              icon={Target}
              title="First Pass Yield"
              value={`${firstPassYield.toFixed(1)}%`}
              subtitle={`${goodParts}/${totalParts} parts`}
              color="bg-purple-500"
            />
          </div>
        </section>

        {/* OEE Performance Metrics */}
        <section className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 mr-4 text-blue-400" />
            OEE Performance Metrics
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <RadialChart
              value={availability}
              size={140}
              color="#10B981"
              label="Availability"
              sublabel="Uptime"
            />
            <RadialChart
              value={performance}
              size={140}
              color="#3B82F6"
              label="Performance"
              sublabel="Speed"
            />
            <RadialChart
              value={quality}
              size={140}
              color="#8B5CF6"
              label="Quality"
              sublabel="First Pass"
            />
            <RadialChart
              value={oeePercentage}
              size={140}
              color="#F59E0B"
              label="OEE"
              sublabel="Overall"
            />
            <RadialChart
              value={oeeLoss}
              size={140}
              color="#EF4444"
              label="OEE Loss"
              sublabel="Total Loss"
            />
          </div>
        </section>

        {/* OEE Loss Analysis Component */}
        <OEELossAnalysis 
          oee={oeePercentage}
          availability={availability}
          performance={performance}
          quality={quality}
        />

        {/* Detailed Calculations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center">
            <Calculator className="w-8 h-8 mr-4 text-green-400" />
            Detailed OEE Calculations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CalculationCard
              title="Availability"
              formula="(Production Time / Planned Production Time) × 100"
              calculation={`(${productionTimeMins.toFixed(1)} / ${plannedProductionTime.toFixed(1)}) × 100`}
              result={availability.toFixed(2)}
              unit="%"
            />
            <CalculationCard
              title="Performance"
              formula="(Ideal Cycle Time × Total Parts) / Operating Time"
              calculation={`(${idealCycleTime.toFixed(4)} × ${totalParts}) / ${machiningTimeMins.toFixed(1)}`}
              result={performance.toFixed(2)}
              unit="%"
            />
            <CalculationCard
              title="Quality"
              formula="(Good Parts / Total Parts) × 100"
              calculation={`(${goodParts} / ${totalParts}) × 100`}
              result={quality.toFixed(2)}
              unit="%"
            />
            <CalculationCard
              title="OEE"
              formula="Availability × Performance × Quality / 10000"
              calculation={`${availability.toFixed(2)} × ${performance.toFixed(2)} × ${quality.toFixed(2)} / 10000`}
              result={oeePercentage.toFixed(2)}
              unit="%"
            />
            <CalculationCard
              title="Actual Cycle Time"
              formula="Machining Time / Total Parts"
              calculation={`${machiningTimeMins.toFixed(1)} / ${totalParts}`}
              result={actualCycleTime.toFixed(4)}
              unit="min/part"
            />
            <CalculationCard
              title="Scrap Rate"
              formula="(Rejected Parts / Total Parts) × 100"
              calculation={`(${rejectedParts} / ${totalParts}) × 100`}
              result={scrapRate.toFixed(2)}
              unit="%"
            />
          </div>
        </section>

        {/* Loss Analysis Breakdown */}
        <section className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 mr-4 text-red-400" />
            OEE Loss Breakdown Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-2xl p-8 border border-red-700/50 text-center">
              <AlertOctagon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-400 mb-3">Availability Loss</h3>
              <div className="text-4xl font-bold text-white mb-3">{availabilityLoss.toFixed(1)}%</div>
              <div className="text-red-200 mb-4">Due to downtime and setup</div>
              <div className="w-full bg-gray-800/80 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(availabilityLoss, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-2xl p-8 border border-yellow-700/50 text-center">
              <TrendingDown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">Performance Loss</h3>
              <div className="text-4xl font-bold text-white mb-3">{performanceLoss.toFixed(1)}%</div>
              <div className="text-yellow-200 mb-4">Due to speed reduction</div>
              <div className="w-full bg-gray-800/80 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-4 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(performanceLoss, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-2xl p-8 border border-purple-700/50 text-center">
              <CheckCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Quality Loss</h3>
              <div className="text-4xl font-bold text-white mb-3">{qualityLoss.toFixed(1)}%</div>
              <div className="text-purple-200 mb-4">Due to defects and rework</div>
              <div className="w-full bg-gray-800/80 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-400 h-4 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(qualityLoss, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Analytics */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center">
            <Info className="w-8 h-8 mr-4 text-blue-400" />
            Advanced Analytics & Business Intelligence
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-2xl p-8 border border-blue-700/50 text-center backdrop-blur-sm">
              <Gauge className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-200 mb-3">Equipment Efficiency</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {((machiningTimeMins / runtimeMins) * 100).toFixed(1)}%
              </div>
              <div className="text-blue-200">Active machining vs total runtime</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-2xl p-8 border border-green-700/50 text-center backdrop-blur-sm">
              <Activity className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-200 mb-3">Production Rate</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {throughput.toFixed(1)}
              </div>
              <div className="text-green-200">Parts per hour</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-2xl p-8 border border-purple-700/50 text-center backdrop-blur-sm">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-200 mb-3">Capacity Utilization</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {targetParts > 0 ? ((totalParts / targetParts) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-purple-200">Actual vs target production</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-2xl p-8 border border-orange-700/50 text-center backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-200 mb-3">Overall Efficiency</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {targetParts > 0 ? ((goodParts / targetParts) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-orange-200">Good parts vs target</div>
            </div>
          </div>
        </section>

        {/* Improvement Recommendations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center">
            <Lightbulb className="w-8 h-8 mr-4 text-yellow-400" />
            Smart Recommendations for OEE Improvement
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                icon={rec.icon}
                title={rec.title}
                description={rec.description}
                priority={rec.priority}
                impact={rec.impact}
              />
            ))}
          </div>
        </section>

        {/* Performance Summary Dashboard */}
        <section className="bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Executive Performance Summary
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-green-400">{availability.toFixed(1)}%</div>
              <div className="text-xl text-gray-200 font-semibold">Availability</div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                availability >= 85 ? 'bg-green-500/20 text-green-400' : 
                availability >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {availability >= 85 ? 'Excellent' : availability >= 70 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-400">{performance.toFixed(1)}%</div>
              <div className="text-xl text-gray-200 font-semibold">Performance</div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                performance >= 85 ? 'bg-green-500/20 text-green-400' : 
                performance >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {performance >= 85 ? 'Excellent' : performance >= 70 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl font-bold text-purple-400">{quality.toFixed(1)}%</div>
              <div className="text-xl text-gray-200 font-semibold">Quality</div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                quality >= 95 ? 'bg-green-500/20 text-green-400' : 
                quality >= 85 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {quality >= 95 ? 'Excellent' : quality >= 85 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl font-bold text-yellow-400">{oeePercentage.toFixed(1)}%</div>
              <div className="text-xl text-gray-200 font-semibold">Overall OEE</div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                oeePercentage >= 85 ? 'bg-green-500/20 text-green-400' : 
                oeePercentage >= 70 ? 'bg-blue-500/20 text-blue-400' : 
                oeePercentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {oeePercentage >= 85 ? 'World Class' : 
                 oeePercentage >= 70 ? 'Good' : 
                 oeePercentage >= 60 ? 'Acceptable' : 
                 'Critical'}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-600/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Quick Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                  <p className="text-gray-300 text-sm">
                    {quality >= 95 ? 'Excellent quality control' : 
                     availability >= 85 ? 'High equipment availability' : 
                     performance >= 85 ? 'Strong performance rate' : 
                     'Focus on improvement opportunities'}
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <h4 className="font-semibold text-yellow-400 mb-2">Priority Focus</h4>
                  <p className="text-gray-300 text-sm">
                    {availability < 70 ? 'Reduce downtime and improve availability' : 
                     performance < 70 ? 'Optimize machine performance and speed' : 
                     quality < 85 ? 'Enhance quality control processes' : 
                     'Maintain current performance levels'}
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <h4 className="font-semibold text-blue-400 mb-2">Potential Gain</h4>
                  <p className="text-gray-300 text-sm">
                    Implementing recommended improvements could increase OEE by{' '}
                    {oeePercentage < 60 ? '25-40%' : oeePercentage < 70 ? '15-25%' : '5-15%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Oee;
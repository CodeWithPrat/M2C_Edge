import React, { useState, useEffect, useRef, useCallback } from "react";
import GaugeComponent from "react-gauge-component";
import { debounce } from "lodash";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowLeftRight, Settings, Zap, Gauge } from 'lucide-react';

// Enhanced error handler
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

// Ultra-Smooth Position Interpolator with Direction Awareness
const useSmoothInterpolation = (targetValue, speed = 0) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animationRef = useRef(null);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef(null);
  const targetValueRef = useRef(targetValue);
  const lastUpdateTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const timeDelta = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;

    // Calculate actual velocity from position changes
    const positionDelta = targetValue - targetValueRef.current;
    if (timeDelta > 0) {
      velocityRef.current = positionDelta / (timeDelta / 1000); // mm/s
    }

    // Determine movement direction
    const movingForward = positionDelta > 0;
    const movingReverse = positionDelta < 0;
    const distance = Math.abs(positionDelta);

    // Skip animation for very small changes to avoid jitter
    if (distance < 0.01) {
      return;
    }

    // Calculate optimal animation duration based on speed and direction
    let duration;
    if (Math.abs(speed) > 1) {
      // Use actual speed for duration calculation
      const estimatedTime = (distance / Math.abs(speed * 0.1)) * 1000; // Convert RPM to mm/s roughly
      duration = Math.max(100, Math.min(2000, estimatedTime));
    } else {
      // Fallback for stationary or low-speed movements
      duration = Math.max(300, Math.min(1500, distance * 8));
    }

    // Adjust for direction (reverse movements can be slightly slower)
    if (movingReverse) {
      duration *= 1.1; // 10% slower for reverse to feel more realistic
    }

    startValueRef.current = currentValue;
    targetValueRef.current = targetValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Direction-aware easing
      let easedProgress;
      if (movingForward) {
        // Slightly faster acceleration for forward movement
        easedProgress = 1 - Math.pow(1 - progress, 2.5);
      } else if (movingReverse) {
        // Smoother deceleration for reverse movement
        easedProgress = 1 - Math.pow(1 - progress, 3.5);
      } else {
        // Standard easing for other cases
        easedProgress = 1 - Math.pow(1 - progress, 3);
      }

      const interpolatedValue = startValueRef.current + 
        (targetValueRef.current - startValueRef.current) * easedProgress;

      setCurrentValue(interpolatedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue]);

  // Initialize current value on mount
  useEffect(() => {
    setCurrentValue(targetValue);
    targetValueRef.current = targetValue;
    lastUpdateTimeRef.current = Date.now();
  }, []);

  return { currentValue, velocity: velocityRef.current };
};

// Ultra-Smooth Feed Drive Animation Component
const FeedDriveAnimation = ({ position, speed, torque, power, limits = { min: 0, max: 700 } }) => {
  const [isUserControlling, setIsUserControlling] = useState(false);
  
  // Use enhanced smooth interpolation with velocity tracking
  const { currentValue: smoothPosition, velocity } = useSmoothInterpolation(position, speed);
  
  // Calculate normalized positions
  const normalizedPosition = ((smoothPosition - limits.min) / (limits.max - limits.min)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, normalizedPosition));

  // Enhanced motion detection
  const isMoving = Math.abs(speed) > 5 || Math.abs(velocity) > 1;
  const motionIntensity = Math.min(1, Math.abs(speed) / 1000);
  const isReverse = speed < -5 || velocity < -1;
  const isForward = speed > 5 || velocity > 1;

  // Separate refs for position and scale animations
  const positionRef = useRef(null);
  const scaleRef = useRef(null);

  // Use refs to avoid style recalculation on every render
  useEffect(() => {
    if (positionRef.current) {
      // Pure position update - no transitions
      const leftPosition = `calc(2rem + ${clampedPosition * (100 - 10) / 100}%)`;
      positionRef.current.style.left = leftPosition;
    }
  }, [clampedPosition]);

  useEffect(() => {
    if (scaleRef.current) {
      // Separate scale animation
      const scaleValue = isMoving ? 1 + motionIntensity * 0.015 : 1;
      scaleRef.current.style.transform = `translateY(-50%) scale(${scaleValue})`;
    }
  }, [isMoving, motionIntensity]);

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-slate-900/95 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
          Feed Axis Animation
        </h2>
        <div className="text-center mb-6">
          <div className="text-xl font-bold text-blue-400 mb-2">
            {smoothPosition.toFixed(3)} <span className="text-lg text-gray-400">mm</span>
          </div>
          <div className="text-sm text-gray-400">
            {clampedPosition.toFixed(2)}% of travel range
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: {position.toFixed(3)}mm | Velocity: {velocity.toFixed(1)}mm/s
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
              isMoving 
                ? (isReverse ? 'bg-orange-400 animate-pulse' : 'bg-green-400 animate-pulse') 
                : 'bg-gray-500'
            }`}></div>
            <span className={isReverse ? 'text-orange-400' : isForward ? 'text-green-400' : 'text-gray-400'}>
              {isReverse ? 'Reverse' : isForward ? 'Forward' : 'Stationary'}
            </span>
          </div>
          <div className="text-xs">
            Range: {limits.min} - {limits.max} mm
          </div>
        </div>
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2 text-gray-400">
            <ArrowLeftRight size={16} className={isMoving ? (isReverse ? 'text-orange-400' : 'text-green-400') : ''} />
            <span className="text-sm">Linear Movement</span>
          </div>
        </div>
      </div>

      {/* Main Animation Container */}
      <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-24 mb-8 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Axis Markers */}
        <div className="absolute top-4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-2 left-8 right-8 flex justify-between text-xs text-blue-400/70">
          {[0, 25, 50, 75, 100].map(percent => (
            <div key={percent} className="flex flex-col items-center">
              <div className="w-px h-2 bg-blue-500/50"></div>
              <span>{((limits.max - limits.min) * percent / 100 + limits.min).toFixed(0)}mm</span>
            </div>
          ))}
        </div>

        {/* Guide Rails */}
        <div className="absolute top-20 left-8 right-8 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>
        <div className="absolute bottom-20 left-8 right-8 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-inner"></div>

        {/* Ball Screw Shaft */}
        <div className="absolute top-1/2 left-8 right-8 h-6 transform -translate-y-1/2">
          <div className="w-full h-full bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 rounded-full shadow-lg relative overflow-hidden">
            {/* Rotating Pattern with direction awareness */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `repeating-linear-gradient(
                  ${isReverse ? '-45deg' : '45deg'},
                  rgba(156, 163, 175, 0.3) 0px,
                  rgba(156, 163, 175, 0.3) 4px,
                  transparent 4px,
                  transparent 8px
                )`,
                animation: isMoving ? `rotate-pattern-${isReverse ? 'reverse' : 'forward'} ${Math.max(0.3, 2 - (Math.abs(speed) / 4000))}s linear infinite` : 'none'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 rounded-full"></div>
          </div>
        </div>

        {/* Current position label - NO VIBRATION */}
        <div
          className="absolute -top-8 text-xs text-blue-400 font-medium"
          style={{ 
            left: `calc(${clampedPosition}% - 20px)`,
            transition: 'none' // Remove all transitions for instant updates
          }}
        >
          {smoothPosition.toFixed(2)}mm
        </div>

        {/* ULTRA-SMOOTH Moving Stage/Table */}
        <div
          ref={positionRef}
          className="absolute top-1/2 h-16 w-20 z-10"
          style={{
            // CRITICAL: No transitions on position, pure JS animation
            transform: 'translateY(-50%)',
            willChange: 'left', // Optimize for left position changes
          }}
        >
          {/* Separate element for scale animation to avoid conflicts */}
          <div
            ref={scaleRef}
            className="w-full h-full"
            style={{
              transform: 'translateY(-50%)',
              transition: 'transform 0.15s ease-out', // Only for scale, not position
              willChange: 'transform'
            }}
          >
            {/* Table Base with enhanced motion effects */}
            <div className={`w-full h-full bg-gradient-to-b from-blue-400/20 via-blue-500/30 to-blue-600/40 rounded-xl border shadow-2xl relative overflow-hidden backdrop-blur-sm transition-colors duration-200 ${
              isReverse 
                ? 'border-orange-400/70 shadow-orange-400/20' 
                : isForward 
                  ? 'border-green-400/70 shadow-green-400/20'
                  : 'border-blue-400/50'
            }`}>
              {/* Dynamic glowing edge based on motion and direction */}
              <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-200 ${
                isReverse
                  ? 'border-orange-400/80 shadow-orange-400/30'
                  : isForward
                    ? 'border-green-400/80 shadow-green-400/30'
                    : 'border-blue-400/60'
              } ${isMoving ? 'animate-pulse' : ''}`}></div>

              {/* Enhanced surface details with motion feedback */}
              <div className={`absolute inset-2 rounded-lg transition-colors duration-200 ${
                isReverse
                  ? 'bg-gradient-to-br from-orange-300/10 to-transparent'
                  : isForward
                    ? 'bg-gradient-to-br from-green-300/10 to-transparent'
                    : 'bg-gradient-to-br from-blue-300/10 to-transparent'
              }`}></div>
              
              {/* Corner indicators with direction-based colors */}
              {[
                { pos: "top-2 left-2" },
                { pos: "top-2 right-2" },
                { pos: "bottom-2 left-2" },
                { pos: "bottom-2 right-2" }
              ].map((corner, i) => (
                <div 
                  key={i}
                  className={`absolute ${corner.pos} w-2 h-2 rounded-full shadow-lg transition-all duration-200 ${
                    isReverse
                      ? 'bg-orange-300/90'
                      : isForward
                        ? 'bg-green-300/90'
                        : 'bg-blue-400/80'
                  } ${isMoving ? 'animate-pulse' : ''}`}
                ></div>
              ))}

              {/* Center Mount with enhanced motion indicator */}
              <div className={`absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-inner transition-all duration-200 ${
                isMoving ? 'bg-gray-200 border-gray-300' : 'bg-gray-300 border-gray-400'
              }`}>
                {isMoving && (
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    isReverse ? 'bg-orange-400/40' : 'bg-green-400/40'
                  }`}></div>
                )}
              </div>

              {/* Direction Arrow */}
              {isMoving && (
                <div className={`absolute top-1 right-1 transition-all duration-200 ${
                  isReverse ? 'text-orange-400' : 'text-green-400'
                }`}>
                  <div className="text-xs font-bold">
                    {isReverse ? '◄' : '►'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Position Indicator with ultra-smooth updates */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-black/90 px-3 py-1 rounded-full whitespace-nowrap border border-blue-400/30">
            <div className={`transition-colors duration-200 ${
              isReverse ? 'text-orange-400' : isForward ? 'text-green-400' : 'text-blue-400'
            }`}>
              {smoothPosition.toFixed(2)}mm
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {velocity.toFixed(1)} mm/s
            </div>
          </div>
        </div>

        {/* Enhanced Motion Trail - ultra-smooth following */}
        {isMoving && (
          <>
            {/* Main trail */}
            <div
              className={`absolute top-1/2 h-3 transform -translate-y-1/2 transition-none`}
              style={{
                left: `calc(2rem + ${clampedPosition * (100 - 10) / 100}% - 60px)`,
                width: '120px',
                background: isReverse 
                  ? `linear-gradient(to right, transparent, rgba(249, 115, 22, ${motionIntensity * 0.6}), transparent)`
                  : `linear-gradient(to right, transparent, rgba(34, 197, 94, ${motionIntensity * 0.6}), transparent)`,
                boxShadow: `0 0 ${15 + motionIntensity * 15}px ${
                  isReverse ? 'rgba(249, 115, 22, 0.4)' : 'rgba(34, 197, 94, 0.4)'
                }`,
                opacity: motionIntensity * 0.9,
              }}
            ></div>
            
            {/* Direction-specific particle effect */}
            <div
              className={`absolute top-1/2 h-1 transform -translate-y-1/2 animate-pulse`}
              style={{
                left: `calc(2rem + ${clampedPosition * (100 - 10) / 100}% ${isReverse ? '+ 30px' : '- 30px'})`,
                width: '20px',
                background: isReverse ? 'rgba(249, 115, 22, 0.8)' : 'rgba(34, 197, 94, 0.8)',
                borderRadius: '50%',
                opacity: motionIntensity
              }}
            ></div>
          </>
        )}

        {/* Motor Section with enhanced motion feedback */}
        <div className="absolute top-1/2 left-2 w-12 h-12 transform -translate-y-1/2">
          <div className={`w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg border relative shadow-xl transition-all duration-200 ${
            isReverse
              ? 'border-orange-400/60 shadow-orange-400/20'
              : isForward
                ? 'border-green-400/60 shadow-green-400/20'
                : power > 5
                  ? 'border-yellow-400/50 shadow-yellow-400/20'
                  : 'border-gray-600'
          }`}>
            <div className="absolute inset-1 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings
                className={`w-6 h-6 transition-all duration-200 ${
                  isReverse 
                    ? 'text-orange-400' 
                    : isForward 
                      ? 'text-green-400' 
                      : 'text-yellow-400'
                } ${isMoving ? 'drop-shadow-lg' : ''}`}
                style={{ 
                  animation: isMoving ? `spin ${Math.max(0.2, 1.5 - (Math.abs(speed) / 5000))}s linear infinite ${isReverse ? 'reverse' : ''}` : 'none',
                  filter: isMoving ? `brightness(${1 + motionIntensity * 0.5})` : 'brightness(1)'
                }}
              />
            </div>

            {/* Enhanced power indicator with direction awareness */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-200 ${
              power > 5 
                ? (isReverse 
                    ? 'bg-orange-400 animate-pulse shadow-orange-400/50 shadow-lg' 
                    : 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg')
                : 'bg-gray-500'
            }`}></div>
          </div>
        </div>

        {/* Enhanced Torque/Power Indicators */}
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col gap-2">
          {/* Torque Indicator */}
          <div className={`bg-black/80 rounded-lg p-2 border transition-all duration-200 ${
            isMoving ? 'border-teal-400/70' : 'border-teal-500/50'
          }`}>
            <div className="flex items-center gap-1 text-xs text-teal-400">
              <Gauge size={12} />
              <span>T</span>
            </div>
            <div className="text-xs text-white font-mono">{torque.toFixed(1)}</div>
            <div className="w-8 h-1 bg-gray-700 rounded-full mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isMoving ? 'bg-teal-300 shadow-teal-300/50 shadow-sm' : 'bg-teal-400'
                }`}
                style={{ width: `${Math.min(100, (torque / 50) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Power Indicator */}
          <div className={`bg-black/80 rounded-lg p-2 border transition-all duration-200 ${
            isMoving ? 'border-pink-400/70' : 'border-pink-500/50'
          }`}>
            <div className="flex items-center gap-1 text-xs text-pink-400">
              <Zap size={12} />
              <span>P</span>
            </div>
            <div className="text-xs text-white font-mono">{power.toFixed(1)}</div>
            <div className="w-8 h-1 bg-gray-700 rounded-full mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isMoving ? 'bg-pink-300 shadow-pink-300/50 shadow-sm' : 'bg-pink-400'
                }`}
                style={{ width: `${Math.min(100, (power / 15) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS with direction-aware animations */}
      <style jsx>{`
        @keyframes rotate-pattern-forward {
          0% { transform: translateX(0); }
          100% { transform: translateX(16px); }
        }
        
        @keyframes rotate-pattern-reverse {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16px); }
        }
        
        @keyframes smoothPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// Enhanced Data Fetching Component with Higher Frequency Polling
const Feed_drive = () => {
  const [data, setData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const unmountedRef = useRef(false);
  const fetchAttemptRef = useRef(0);
  const lastDataRef = useRef(null);

  // Optimized polling for ultra-smooth animation
  const fetchData = useCallback(async () => {
    if (unmountedRef.current) return;

    try {
      const response = await fetch(`https://cmti-edge.online/M2C/Backend/OPCUA_FeedDrive.php?action=realtime&lastId=${lastId}&t=${Date.now()}`);
      const result = await response.json();

      if (!unmountedRef.current && result.status === "success") {
        if (result.hasNewData && Array.isArray(result.data)) {
          const latestData = result.data[0];
          
          // Enhanced smoothing with outlier detection
          if (lastDataRef.current) {
            const positionDiff = Math.abs(parseFloat(latestData.position) - parseFloat(lastDataRef.current.position));
            const timeDiff = new Date(latestData.timestamp) - new Date(lastDataRef.current.timestamp);
            
            // Calculate implied velocity
            const impliedVelocity = timeDiff > 0 ? (positionDiff / (timeDiff / 1000)) : 0;
            
            // Reject impossible jumps (> 500mm/s)
            if (impliedVelocity > 500) {
              console.warn(`Rejecting impossible position jump: ${positionDiff}mm in ${timeDiff}ms (${impliedVelocity.toFixed(1)}mm/s)`);
              return; // Skip this data point
            }
          }
          
          setData(latestData);
          setLastId(latestData.id);
          lastDataRef.current = latestData;

          // Add to historical data with smoothing
          result.data.reverse().forEach(dataPoint => {
            const timestamp = new Date(dataPoint.timestamp);
            const newDataPoint = {
              timestamp: timestamp.toLocaleTimeString(),
              time: timestamp.getTime(),
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
              return updated.slice(-50); // Keep more points for better interpolation
            });
          });
        } else if (result.data && !result.hasNewData) {
          const currentData = result.data;
          if (!data) {
            setData(currentData);
            lastDataRef.current = currentData;
            
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

            setHistoricalData([newDataPoint]);
          }

          if (currentData.id > lastId) {
            setLastId(currentData.id);
          }
        }

        setConnectionStatus("connected");
        setInitialLoading(false);
        fetchAttemptRef.current = 0;
      } else if (result.status === "error") {
        throw new Error(result.message || "API response unsuccessful");
      }
    } catch (err) {
      if (!unmountedRef.current) {
        console.error("Error:", err);

        if (fetchAttemptRef.current >= 2) {
          setConnectionStatus("disconnected");
        } else {
          fetchAttemptRef.current += 1;
          setConnectionStatus("reconnecting");
        }

        // Fallback for initial load
        if (!data) {
          try {
            const fallbackResponse = await fetch("https://cmti-edge.online/M2C/Backend/OPCUA_FeedDrive.php?action=latest");
            const fallbackResult = await fallbackResponse.json();

            if (fallbackResult.status === "success" && fallbackResult.data) {
              setData(fallbackResult.data);
              setLastId(fallbackResult.data.id);
              lastDataRef.current = fallbackResult.data;

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

    // Initial fetch
    fetchData();

    // CRITICAL: Much higher frequency polling for ultra-smooth animation (800ms)
    const interval = setInterval(fetchData, 800);

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
            Initializing Ultra-Smooth Feed Drive System...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white" style={{ willChange: "contents" }}>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          connectionStatus === "connected"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : connectionStatus === "reconnecting"
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {connectionStatus === "connected"
            ? "● Ultra-Live (800ms)"
            : connectionStatus === "reconnecting"
              ? "○ Syncing..."
              : "○ Offline"
          }
        </div>
      </div>

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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-2">
            Feed Drive System
          </h1>
          <div className="text-gray-400 text-lg">
            Real-time Machine Monitoring
          </div>
        </div>

        {/* Feed Drive Animation - Main Feature */}
        <div className="mb-8 max-w-7xl mx-auto">
          <FeedDriveAnimation
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
              Showing {historicalData.length} data points from ultra-fast API (800ms intervals)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed_drive;
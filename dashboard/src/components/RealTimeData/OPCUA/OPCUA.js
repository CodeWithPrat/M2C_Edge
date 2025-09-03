import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    Database,
    Cpu,
    Settings,
    ChevronRight,
    Monitor,
    Activity,
    Zap
} from 'lucide-react';

const OPCUA = () => {
    const location = useLocation();

    const subItems = [
        {
            name: 'Ideal Digital Twin',
            path: 'ideal-digital-twin',
            icon: Cpu,
            description: 'Virtual representation of an ideal machine configuration',
            color: 'from-purple-500 to-pink-500',
            bgGlow: 'bg-purple-500/10 border-purple-500/20'
        },
        {
            name: 'Lathe Machine',
            path: 'lathe-machine',
            icon: Settings,
            description: 'Real-time monitoring and control of lathe machines',
            color: 'from-blue-500 to-cyan-500',
            bgGlow: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            name: 'Milling Machine',
            path: 'milling-machine',
            icon: Monitor,
            description: 'Real-time monitoring and control of milling machines',
            color: 'from-emerald-500 to-teal-500',
            bgGlow: 'bg-emerald-500/10 border-emerald-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5"></div>
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                            <div className="relative p-4 bg-black rounded-2xl">
                                <Database className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                                OPC UA Interface
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                Unified Architecture for industrial communication and real-time data exchange
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Activity className="w-4 h-4" />
                                <span>Live Monitoring</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Zap className="w-4 h-4" />
                                <span>High Performance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
                    {/* Navigation Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-4 bg-gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-800/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                                <h2 className="text-lg sm:text-xl font-bold text-white">Machine Interfaces</h2>
                            </div>
                            
                            <nav className="space-y-3">
                                {subItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.includes(item.path);

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`relative group block p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-emerald-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20'
                                                    : 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
                                            }`}
                                            style={{
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-emerald-500/10 rounded-xl sm:rounded-2xl animate-pulse"></div>
                                            )}
                                            
                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`relative p-2 rounded-lg ${isActive ? item.bgGlow : 'bg-gray-700/50 group-hover:bg-gray-600/50'} transition-all duration-300`}>
                                                        {isActive && (
                                                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg opacity-20 animate-pulse`}></div>
                                                        )}
                                                        <Icon className={`relative w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`block font-semibold text-sm sm:text-base leading-tight ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors duration-300`}>
                                                            {item.name}
                                                        </span>
                                                        <span className="block text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 ml-2 flex-shrink-0 transition-all duration-300 ${
                                                    isActive 
                                                        ? 'rotate-90 text-blue-400' 
                                                        : 'text-gray-500 group-hover:text-white group-hover:translate-x-1'
                                                }`} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Connection Status */}
                            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                        <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-emerald-400">Connected</div>
                                        <div className="text-xs text-gray-500">All systems operational</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="xl:col-span-3">
                        <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800/50 min-h-[500px] sm:min-h-[600px]">
                            <Outlet />

                            {/* Default content when no nested route is selected */}
                            {location.pathname.endsWith('/opcua')
                            // && (
                            //     <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            //         <div className="relative mb-8">
                            //             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            //             <div className="relative p-8 bg-gray-900/50 rounded-full border border-gray-700/50">
                            //                 <Network className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                            //             </div>
                            //         </div>
                                    
                            //         <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
                            //             Select a Machine Interface
                            //         </h3>
                                    
                            //         <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed mb-8">
                            //             Choose from the available machine interfaces to view real-time data,
                            //             configure settings, and monitor performance metrics.
                            //         </p>
                            //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
                            //             {[
                            //                 { icon: Activity, label: 'Real-time Data', color: 'text-blue-400' },
                            //                 { icon: Settings, label: 'Configuration', color: 'text-purple-400' },
                            //                 { icon: Zap, label: 'Performance', color: 'text-emerald-400' }
                            //             ].map((feature, index) => (
                            //                 <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
                            //                     <feature.icon className={`w-6 h-6 ${feature.color} mb-2 group-hover:scale-110 transition-transform duration-300`} />
                            //                     <div className="text-sm font-medium text-gray-300">{feature.label}</div>
                            //                 </div>
                            //             ))}
                            //         </div>
                            //     </div>
                            // )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OPCUA;
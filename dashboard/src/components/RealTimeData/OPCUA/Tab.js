import React, { useState, useEffect } from 'react';
import { Cpu, BarChart3, Settings } from 'lucide-react';
import Spindle from './Spindle';
import Feeddrive from './Feed_drive';

const Tab = () => {
    const [activeTab, setActiveTab] = useState('Spindle');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const tabs = [
        {
            id: 'Spindle',
            label: 'Spindle',
            icon: <Settings className="w-5 h-5" />,
            color: 'from-blue-500 via-purple-500 to-pink-500'
        },
        {
            id: 'Feeddrive',
            label: 'Feeddrive',
            icon: <Cpu className="w-5 h-5" />,
            color: 'from-fuchsia-500 via-purple-600 to-indigo-500',
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Spindle':
                return (
                    <div className="">
                        <Spindle />
                    </div>
                );
            case 'Feeddrive':
                return (
                    <div className="">
                        <Feeddrive/>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-7h-screen bg-black relative overflow-hidden">
            {/* Main Content */}
            <div className={`relative z-10 min-h-screen flex flex-col transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-2 flex justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <h1 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
                                OPC-UA Protocol Data Monitoring
                            </h1>
                            <p className="text-gray-300 text-xl">Real-time Monitoring</p>
                        </div>
                    </div>
                </div>


                {/* Tab Navigation */}
                <div className="flex-shrink-0 px-8 py-6">
                    <div className="flex space-x-2 bg-black/40 backdrop-blur-sm rounded-2xl p-2 border border-brand-purple/20">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${activeTab === tab.id
                                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-brand-purple/30`
                                        : 'text-brand-sky/70 hover:text-white hover:bg-brand-purple/10'
                                    }`}
                            >
                                <span className={`transition-all duration-300 ${activeTab === tab.id ? 'animate-pulse' : ''}`}>
                                    {tab.icon}
                                </span>
                                <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 px-8 pb-8">
                    <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl">
                        <div className={`w-full h-full transition-all duration-700 transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Tab;
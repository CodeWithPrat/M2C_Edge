import React, { useState, useEffect } from 'react';
import {
    Cpu,
    Wifi,
    Shield,
    Monitor,
    Database,
    Zap,
    ChevronLeft,
    ChevronRight,
    Settings,
    HardDrive,
    Network,
    Plug,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Star,
    Award,
} from 'lucide-react';

import M2CLogo from "../../images/logos/M2CLogo.png"

import pic1 from "../../images/RAWPics/IMG20250820110825-removebg-preview.png"
import pic2 from "../../images/RAWPics/IMG20250820111137-removebg-preview.png"
import pic3 from "../../images/RAWPics/IMG20250820111147-removebg-preview.png"
import pic4 from "../../images/RAWPics/IMG20250820111205-removebg-preview.png"
import pic5 from "../../images/RAWPics/IMG20250820111333-removebg-preview.png"
import pic6 from "../../images/RAWPics/IMG20250820111354-removebg-preview.png"
import pic7 from "../../images/RAWPics/M2C.png"

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Mock product images - placeholder rectangles for demonstration
    const productImages = [
        { id: 1, image: pic1 },
        { id: 2, image: pic2 },
        { id: 3, image: pic3 },
        { id: 4, image: pic4 },
        { id: 5, image: pic5 },
        { id: 6, image: pic6 },
        { id: 7, image: pic7 },
    ];

    const features = [
        {
            icon: Cpu,
            title: "Advanced Processing Power",
            description: "CMTI Custom Designed Embedded Processor with Broadcom BCM2712 Quad-Core Cortex-A76 @ 2.4 GHz for high-performance edge computing",
            color: "text-blue-400",
            bgColor: "from-blue-600/20 to-blue-800/10",
            borderColor: "border-blue-500/30"
        },
        {
            icon: Wifi,
            title: "Comprehensive Connectivity",
            description: "Dual-band Wi-Fi (2.4GHz/5GHz), Gigabit Ethernet, Bluetooth 5.0, and multiple industrial communication ports",
            color: "text-cyan-400",
            bgColor: "from-cyan-600/20 to-cyan-800/10",
            borderColor: "border-cyan-500/30"
        },
        {
            icon: Shield,
            title: "Industrial Protocol Support",
            description: "Native support for OPC-UA, Modbus TCP/IP, RS485, and RS232 for seamless machine-to-cloud connectivity",
            color: "text-indigo-400",
            bgColor: "from-indigo-600/20 to-indigo-800/10",
            borderColor: "border-indigo-500/30"
        },
        {
            icon: Monitor,
            title: "Full HD Touch Display",
            description: "13.3-inch Full HD (1920x1080) capacitive touchscreen with 10-point multi-touch support for intuitive operation",
            color: "text-purple-400",
            bgColor: "from-purple-600/20 to-purple-800/10",
            borderColor: "border-purple-500/30"
        },
        {
            icon: Database,
            title: "High-Performance Storage",
            description: "8GB LPDDR4X RAM with 32GB ROM and expandable storage up to 128GB eMMC for extensive data processing",
            color: "text-emerald-400",
            bgColor: "from-emerald-600/20 to-emerald-800/10",
            borderColor: "border-emerald-500/30"
        },
        {
            icon: Zap,
            title: "Cloud Integration",
            description: "Advanced cloud-based data logging, PLC integration, and real-time monitoring with EDGE-based dashboard",
            color: "text-yellow-400",
            bgColor: "from-yellow-600/20 to-yellow-800/10",
            borderColor: "border-yellow-500/30"
        }
    ];

    const specifications = [
        { label: "Processor", value: "Broadcom BCM2712", detail: "Quad-Core Cortex-A76 @ 2.4 GHz", icon: <Cpu className="w-4 h-4" /> },
        { label: "Memory", value: "8GB LPDDR4X", detail: "32GB ROM (up to 128GB eMMC)", icon: <HardDrive className="w-4 h-4" /> },
        { label: "Display", value: "13.3\" Full HD", detail: "1920x1080 Touch Display", icon: <Monitor className="w-4 h-4" /> },
        { label: "Connectivity", value: "Gigabit + Wi-Fi", detail: "Ethernet, Dual-band, Bluetooth 5.0", icon: <Network className="w-4 h-4" /> },
        { label: "I/O Ports", value: "Multi-Interface", detail: "RS485/232, USB, MicroSD", icon: <Plug className="w-4 h-4" /> },
        { label: "Power", value: "DC 12V, 2A", detail: "Efficient Power Supply", icon: <Zap className="w-4 h-4" /> },
        { label: "OS", value: "Linux OS", detail: "Raspbian Operating System", icon: <Settings className="w-4 h-4" /> },
        { label: "Touch", value: "10-Point Multi", detail: "Capacitive Touch Support", icon: <Monitor className="w-4 h-4" /> }
    ];

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % productImages.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, productImages.length]);

    const nextImage = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImage((prev) => (prev + 1) % productImages.length);
            setIsTransitioning(false);
        }, 150);
    };

    const prevImage = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
            setIsTransitioning(false);
        }, 150);
    };

    const goToImage = (index) => {
        if (isTransitioning || index === currentImage) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImage(index);
            setIsTransitioning(false);
        }, 150);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="realtive inset-0 bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-gray-900"></div>
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(29, 78, 216, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.8) 0%, transparent 100%)`,
                        transform: `translateY(${scrollY * 0.5}px)`
                    }}
                ></div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center mt-[-100px] px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center mb-12 lg:mb-16">
                            {/* Hero Badge */}
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-8 hover:border-blue-400/50 transition-all duration-300">
                                <Star className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-300 font-medium text-sm tracking-wide">INDUSTRIAL IoT SOLUTION</span>
                                <Star className="w-4 h-4 text-blue-400" />
                            </div>

                            {/* Main Logo/Title */}
                            <div className="mb-8 flex items-center justify-center">
                                <div className="">
                                    <img
                                        src={M2CLogo}
                                        alt="M2C Edge Module Logo"
                                        className="w-52 h-36"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                                        <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                                            M2C-EDGE-LINK
                                        </span>
                                    </h1>
                                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-6"></div>
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-300 mb-6 tracking-wide">
                                        Universal Machine to Cloud Connecting EDGE Device
                                    </h2>
                                </div>
                            </div>

                            {/* Hero Description */}
                            <div className="max-w-4xl mx-auto">
                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 font-light">
                                    Revolutionary digital cloud gateway enabling seamless connectivity to any machine or industrial process.
                                    <span className="text-blue-300 font-medium"> Advanced processing power</span> meets
                                    <span className="text-blue-300 font-medium"> comprehensive connectivity</span> for the future of industrial IoT.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => {
                                        const featuresSection = document.getElementById('product-showcase');
                                        featuresSection?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 border border-blue-500/50"
                                >
                                    <span className="flex items-center gap-2">
                                        <Award className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                        Explore Features
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        const contactSection = document.getElementById('contact-section');
                                        contactSection?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 bg-black/50 hover:bg-black/70 text-blue-300 hover:text-white font-semibold rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                                >
                                    Contact Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Showcase Section */}
                <section id="product-showcase" className="py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                            {/* Product Carousel */}
                            <div className="order-2 lg:order-1">
                                <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-black/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-700 group">

                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                            Product Gallery
                                        </h3>
                                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
                                    </div>

                                    {/* Main Image Display */}
                                    <div className="relative mb-8">
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl overflow-hidden border border-slate-600/50 group-hover:border-blue-500/50 transition-all duration-500">

                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Image */}
                                            <div className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}`}>
                                                <img
                                                    src={productImages[currentImage].image}
                                                    alt={`M2C-EDGE-LINK Device View ${currentImage + 1}`}
                                                    className="w-full h-full object-cover rounded-2xl"
                                                    style={{
                                                        filter: 'brightness(0.9) contrast(1.1)'
                                                    }}
                                                />

                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>
                                            </div>

                                            {/* Navigation Arrows */}
                                            <button
                                                onClick={prevImage}
                                                disabled={isTransitioning}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10 disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={nextImage}
                                                disabled={isTransitioning}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10 disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>

                                            {/* Image Counter */}
                                            <div className="absolute top-4 right-4 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
                                                {currentImage + 1} / {productImages.length}
                                            </div>
                                        </div>

                                        {/* Thumbnail Navigation */}
                                        <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                                            {productImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToImage(index)}
                                                    className={`flex-shrink-0 w-12 h-8 rounded-lg border-2 transition-all duration-300 ${index === currentImage
                                                            ? 'border-blue-500 bg-blue-500/20'
                                                            : 'border-slate-600/50 hover:border-slate-400/50 bg-slate-800/50'
                                                        }`}
                                                >
                                                    <div className={`w-full h-full rounded-md ${index === currentImage ? 'bg-blue-400/30' : 'bg-slate-700/50'
                                                        }`}></div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Auto-play Toggle */}
                                        <div className="flex justify-center mt-6">
                                            <button
                                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${isAutoPlaying
                                                        ? 'bg-blue-600/80 text-white border-blue-500/50 hover:bg-blue-500/80'
                                                        : 'bg-slate-800/80 text-slate-300 border-slate-600/50 hover:bg-slate-700/80'
                                                    }`}
                                            >
                                                {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="order-1 lg:order-2 space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6">
                                        <Award className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-300 font-medium text-sm">PREMIUM INDUSTRIAL SOLUTION</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                        Next-Gen
                                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                                            Industrial IoT
                                        </span>
                                        Gateway
                                    </h2>

                                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8"></div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        The M2C-EDGE-LINK represents the pinnacle of industrial connectivity, seamlessly bridging the gap between legacy machinery and modern cloud infrastructure.
                                    </p>

                                    <div className="grid gap-4">
                                        {[
                                            { icon: Shield, text: "Multi-protocol industrial communication" },
                                            { icon: Zap, text: "Real-time data processing and analytics" },
                                            { icon: Monitor, text: "Intuitive touchscreen interface" },
                                            { icon: Database, text: "Secure cloud data transmission" }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 group">
                                                <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors duration-300">
                                                    <item.icon className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <span className="text-gray-300 font-medium">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Specifications Section */}
                <section className="py-20 lg:py-32 bg-gradient-to-b from-transparent to-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-600/30 mb-6">
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300 font-medium text-sm">TECHNICAL EXCELLENCE</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Specifications
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Engineered with precision and built for performance
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-black/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="group bg-gradient-to-br from-slate-800/60 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/90 rounded-2xl p-6 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors duration-300">
                                                <div className="text-blue-400 group-hover:text-blue-300">
                                                    {spec.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-slate-300 font-medium text-sm mb-1">{spec.label}</div>
                                                <div className="text-white font-bold text-lg leading-tight">
                                                    {spec.value}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                                            {spec.detail}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full border border-blue-500/30 mb-6">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-300 font-medium text-sm">POWERFUL CAPABILITIES</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Key Features &
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block lg:inline">
                                    {" "}Capabilities
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Advanced technology stack designed for seamless industrial integration and cloud connectivity
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-2xl p-8 shadow-xl border ${feature.borderColor} hover:border-opacity-80 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl overflow-hidden`}
                                    style={{
                                        animationDelay: `${index * 150}ms`,
                                    }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-slate-600/30`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color} group-hover:brightness-110`} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                                        {feature.description}
                                    </p>

                                    {/* Hover Accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact-section" className="py-20 lg:py-32 bg-gradient-to-b from-slate-900/30 to-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-full border border-slate-600/30 mb-6">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300 font-medium text-sm">GET IN TOUCH</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Contact Our
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block lg:inline">
                                    {" "}Expert Team
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Ready to transform your industrial processes? Connect with our specialists today
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Organization Card */}
                            <div className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-blue-300 group-hover:text-blue-200">
                                        Organization
                                    </h4>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h5 className="text-lg font-bold text-white mb-2 leading-tight">
                                            Smart Manufacturing IIOT & Artificial Intelligence (c-SMPM)
                                        </h5>
                                        <p className="text-blue-200 font-medium mb-3">Central Manufacturing Technology Institute</p>

                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                Yeshwanthpur Industrial Area, Phase 1, Yeswanthpur, Bengaluru, Karnataka 560022
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-blue-400" />
                                            <a
                                                href="https://cmti.res.in/smart-manufacturing-iiot-artificial-intelligence/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm hover:underline break-all"
                                            >
                                                cmti.res.in/smart-manufacturing-iiot-ai
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Personnel Card */}
                            <div className="bg-gradient-to-br from-indigo-900/40 via-indigo-800/30 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-indigo-300 group-hover:text-indigo-200">
                                        Key Personnel
                                    </h4>
                                </div>

                                <div className="space-y-6">
                                    {/* Person 1 */}
                                    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
                                        <h5 className="text-lg font-bold text-white mb-1">Mr. Prakash Vinod</h5>
                                        <p className="text-indigo-300 text-sm font-medium mb-3">Center Head and Joint Director</p>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-indigo-400" />
                                            <a
                                                href="mailto:prakashv@cmti.res.in"
                                                className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm hover:underline"
                                            >
                                                prakashv@cmti.res.in
                                            </a>
                                        </div>
                                    </div>

                                    {/* Person 2 */}
                                    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
                                        <h5 className="text-lg font-bold text-white mb-1">Mr. Harikrishna Satish Thota</h5>
                                        <p className="text-indigo-300 text-sm font-medium mb-3">Scientist - D</p>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-indigo-400" />
                                            <a
                                                href="mailto:harithota@cmti.res.in"
                                                className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm hover:underline"
                                            >
                                                harithota@cmti.res.in
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Card */}
                            <div className="bg-gradient-to-br from-emerald-900/40 via-emerald-800/30 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-emerald-300 group-hover:text-emerald-200">
                                        Contact Details
                                    </h4>
                                </div>

                                <div className="space-y-6">
                                    {/* Office Contact */}
                                    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
                                        <h5 className="text-lg font-bold text-white mb-4">Office Contact</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-emerald-400" />
                                                <a
                                                    href="tel:+918022188243"
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                                                >
                                                    +91-80-22188243
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-emerald-400" />
                                                <a
                                                    href="tel:+919449842680"
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                                                >
                                                    +91-9449842680
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Department Contact */}
                                    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
                                        <h5 className="text-lg font-bold text-white mb-4">Department Contact</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-emerald-400" />
                                                <a
                                                    href="tel:+918022188390"
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                                                >
                                                    +91-8022188390
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-emerald-400" />
                                                <a
                                                    href="tel:+917795090050"
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                                                >
                                                    +91-7795090050
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="mt-16 flex justify-center">
                            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-1deg); 
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2); 
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
            line-height: 1.1;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 2px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #60a5fa, #2563eb);
        }
      `}</style>
        </div>
    );
};

export default Home;
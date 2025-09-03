import React, { useState, useEffect } from 'react';
import {
    User, Lock, Briefcase, Clock, Target, Award, Download, LogOut, Plus,
    Calendar, TrendingUp, Activity, Star, AlertTriangle, Play, CheckCircle2,
    FileText, Upload, Camera, Settings, Power, Cpu, Gauge, Timer,
    RotateCcw, Wrench, Package, BarChart3, Zap, Layers, Monitor,
    PlayCircle, PauseCircle, Square, ChevronRight, Eye, RefreshCw
} from 'lucide-react';

import MONO from "../../images/RAWPics/mono200.png"

const API_BASE = 'https://cmti-edge.online/M2C/Backend/SignIn1.php';
const EMPLOYEE_API = 'https://cmti-edge.online/M2C/Backend/EmployeePage.php';
const MACHINE_API = 'https://cmti-edge.online/M2C/Backend/MachineDetails.php';
const LATEST_JOB_API = 'https://cmti-edge.online/M2C/Backend/SignIn1.php?api&latest';

const EmployeeDashboard = ({ employeeData, userType, onLogout }) => {
    // State management
    const [machineData, setMachineData] = useState(null);
    const [latestJob, setLatestJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [myReports, setMyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Report submission state
    const [reportForm, setReportForm] = useState({
        job_id: '',
        report_text: '',
        report_date: new Date().toISOString().split('T')[0],
        staff_number: employeeData?.staff_number || '',
    });

    const [uploadForm, setUploadForm] = useState({
        job_id: '',
        report_text: '',
        report_date: new Date().toISOString().split('T')[0],
        file: null
    });

    const [submitLoading, setSubmitLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch all required data
    useEffect(() => {
        if (userType === 'employee') {
            fetchAllData();
            const interval = setInterval(fetchAllData, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [userType]);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Fetch machine data
            const machineResponse = await fetch(MACHINE_API, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if (!machineResponse.ok) {
                throw new Error(`HTTP error! status: ${machineResponse.status}`);
            }
            const machineResult = await machineResponse.json();

            if (machineResult.success && machineResult.data.length > 0) {
                setMachineData(machineResult.data[0]);
            }

            // Fetch latest job
            const jobResponse = await fetch(LATEST_JOB_API, {
                credentials: 'include'
            });
            const jobResult = await jobResponse.json();
            setLatestJob(jobResult);

            // Fetch all jobs
            const allJobsResponse = await fetch(`${API_BASE}?api=true&action=jobs`, {
                credentials: 'include'
            });
            const allJobsResult = await allJobsResponse.json();
            if (allJobsResult.success) {
                setJobs(allJobsResult.jobs || []);
            }

            // Fetch my reports
            const reportsResponse = await fetch(`${API_BASE}?api=true&action=my_reports`, {
                credentials: 'include'
            });
            const reportsResult = await reportsResponse.json();
            if (reportsResult.success) {
                setMyReports(reportsResult.reports || []);
            }

        } catch (err) {
            setError('Failed to fetch data' + err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle job status update
    const updateJobStatus = async (jobId, status) => {
        try {
            const response = await fetch(`${API_BASE}?api=true`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'update_job_status',
                    job_id: jobId,
                    status: status
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setMessage(`Job status updated to ${status}`);
                fetchAllData(); // Refresh data
            } else {
                setMessage('Failed to update job status' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            setMessage('Error updating job status' + error.message);
        }
    };

    // Handle report submission
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportForm.job_id || !reportForm.report_text) {
            setMessage('Please fill in all required fields');
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await fetch(`${API_BASE}?api=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'submit_report',
                    ...reportForm
                })
            });

            const result = await response.json();
            if (result.success) {
                setMessage('Report submitted successfully!');
                setReportForm({
                    job_id: '',
                    report_text: '',
                    report_date: new Date().toISOString().split('T')[0],
                    staff_number: employeeData?.staff_number || '',
                });
                fetchAllData();
            } else {
                setMessage('Failed to submit report');
            }
        } catch (error) {
            setMessage('Error submitting report');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.job_id || !uploadForm.file) {
            setMessage('Please select a job and file to upload');
            return;
        }

        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append('upload_document', '1');
            formData.append('job_id', uploadForm.job_id);
            formData.append('report_text', uploadForm.report_text);
            formData.append('report_date', uploadForm.report_date);
            formData.append('report_file', uploadForm.file);

            const response = await fetch(EMPLOYEE_API, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            // Since this might return HTML, we'll assume success if no error
            setMessage('Document uploaded successfully!');
            setUploadForm({
                job_id: '',
                report_text: '',
                report_date: new Date().toISOString().split('T')[0],
                file: null
            });
            fetchAllData();
        } catch (error) {
            setMessage('Error uploading document');
        } finally {
            setSubmitLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'in progress': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'to-do': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getMachineStatusColor = (status) => {
        return status === 'Running' ? 'text-emerald-400' : 'text-rose-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-800 border-t-violet-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin animate-reverse mx-auto"></div>
                    </div>
                    <p className="text-slate-400 text-lg font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-black text-white">
            {/* Background Effects */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Machine Status Section */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Machine Details - Takes 2 columns on XL screens */}
                    <div className="xl:col-span-2 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 p-6 border-b border-slate-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-violet-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                                        <Monitor className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold text-white">Machine Status</h2>
                                        <p className="text-slate-400">Real-time monitoring</p>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchAllData}
                                    className="p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Machine Data Grid */}
                        <div className="p-6">
                            {machineData ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Status */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</h3>
                                            <div className={`flex items-center ${getMachineStatusColor(machineData.Machine_status)}`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${machineData.Machine_status === 'Running' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`}></div>
                                                <span className="font-medium text-sm">{machineData.Machine_status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Machine Name */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <Settings className="w-4 h-4 text-violet-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Machine</h3>
                                        </div>
                                        <p className="text-white font-semibold text-lg">{machineData.Machine_name}</p>
                                    </div>

                                    {/* Alarms */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Alarms</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-amber-400">{parseFloat(machineData.alarm_count) || 0}</p>
                                        <p className="text-slate-500 text-xs">Ref: {machineData.reference_number}</p>
                                    </div>

                                    {/* Runtime */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <Timer className="w-4 h-4 text-emerald-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Runtime</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-400">{parseFloat(machineData.machine_runtime) || 0}</p>
                                        <p className="text-slate-500 text-xs">Hours</p>
                                    </div>

                                    {/* Spindle Override */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <RotateCcw className="w-4 h-4 text-violet-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Spindle Override</h3>
                                        </div>
                                        <div className="flex items-end space-x-3">
                                            <p className="text-xl font-bold text-violet-400">{parseFloat(machineData.spindle_override) || 0}%</p>
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min(parseFloat(machineData.spindle_override) || 0, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feed-rate Override */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <Gauge className="w-4 h-4 text-orange-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Feed-rate Override</h3>
                                        </div>
                                        <div className="flex items-end space-x-3">
                                            <p className="text-xl font-bold text-orange-400">{parseFloat(machineData.feedrate_override) || 0}%</p>
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min(parseFloat(machineData.feedrate_override) || 0, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Operating Mode */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <Power className="w-4 h-4 text-cyan-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Mode</h3>
                                        </div>
                                        <span className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-3 py-1.5 rounded-lg text-sm font-semibold border border-cyan-500/30">
                                            {machineData.operating_mode}
                                        </span>
                                    </div>

                                    {/* Program Name */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <FileText className="w-4 h-4 text-indigo-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Program</h3>
                                        </div>
                                        <p className="text-indigo-300 text-sm font-mono break-all leading-relaxed">
                                            {machineData.program_name}
                                        </p>
                                    </div>

                                    {/* Part Count */}
                                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center mb-2">
                                            <Package className="w-4 h-4 text-pink-400 mr-2" />
                                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Parts</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-pink-400">{parseInt(machineData.part_count) || 0}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Monitor className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <p className="text-slate-400">No machine data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Machine Visual - Takes 1 column on XL screens */}
                    <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-slate-600/20 to-slate-500/20 p-6 border-b border-slate-800/50">
                            <h3 className="text-xl font-bold text-white">Machine Visual</h3>
                        </div>
                        <div className="p-4">
                            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl aspect-square flex items-center justify-center border border-slate-700/30">
                                <div className="text-center">
                                    <div className="mb-2">
                                        <img
                                            src={MONO}
                                            alt="MONO-200 Machine Visual"
                                            className="w-72 h-56"
                                        />
                                    </div>

                                    <h4 className="text-white font-bold text-lg mb-2">
                                        {machineData?.Machine_name || 'Mono-200'}
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Status: <span className={getMachineStatusColor(machineData?.Machine_status)}>
                                            {machineData?.Machine_status || 'Unknown'}
                                        </span>
                                    </p>
                                    {latestJob && (
                                        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl p-4 border border-violet-500/30 shadow-lg">
                                            <p className="text-violet-300 text-sm font-medium mb-1">Current Job</p>
                                            <p className="text-white font-bold">{latestJob.job_name}</p>
                                            <p className="text-slate-400 text-xs mt-1">Target: {latestJob.target_parts} parts</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-slate-900/50 rounded-2xl p-2 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${activeTab === 'overview'
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <Briefcase className="w-5 h-5 mr-2" />
                        Job Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${activeTab === 'reports'
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        Daily Reports
                    </button>
                </div>

                {/* Job Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 border-b border-slate-800/50">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-2xl font-bold text-white">Job Assignments</h2>
                                    <p className="text-slate-400">Manage your assigned jobs</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {jobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {jobs.map((job) => (
                                        <div key={job.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300 group hover:shadow-xl">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300 mb-3">
                                                        {job.job_name}
                                                    </h3>
                                                    <div className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(job.status)}`}>
                                                        {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                        {job.status === 'in progress' && <PlayCircle className="w-4 h-4 mr-2" />}
                                                        {job.status === 'to-do' && <Square className="w-4 h-4 mr-2" />}
                                                        {job.status || 'TO-DO'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                                <div className="flex items-center text-slate-400">
                                                    <Target className="w-4 h-4 mr-2 text-cyan-400" />
                                                    <span>{job.target_parts} parts</span>
                                                </div>
                                                <div className="flex items-center text-slate-400">
                                                    <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                                                    <span>{job.cycle_time}m cycle</span>
                                                </div>
                                                <div className="flex items-center text-slate-400">
                                                    <Award className="w-4 h-4 mr-2 text-amber-400" />
                                                    <span>{job.quality_estimation} good</span>
                                                </div>
                                                <div className="flex items-center text-slate-400">
                                                    <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                                                    <span>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Today'}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => updateJobStatus(job.id, 'TO-DO')}
                                                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ${job.status === 'to-do'
                                                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border border-cyan-500/50 shadow-lg'
                                                        : 'bg-slate-700/50 text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-600/50'
                                                        }`}
                                                >
                                                    TO-DO
                                                </button>
                                                <button
                                                    onClick={() => updateJobStatus(job.id, 'IN PROGRESS')}
                                                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ${job.status === 'in progress'
                                                        ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 border border-amber-500/50 shadow-lg'
                                                        : 'bg-slate-700/50 text-slate-400 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-600/50'
                                                        }`}
                                                >
                                                    PROGRESS
                                                </button>
                                                <button
                                                    onClick={() => updateJobStatus(job.id, 'COMPLETED')}
                                                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ${job.status === 'completed'
                                                        ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-300 border border-emerald-500/50 shadow-lg'
                                                        : 'bg-slate-700/50 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-600/50'
                                                        }`}
                                                >
                                                    DONE
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-xl font-medium mb-2">No jobs assigned yet</p>
                                    <p className="text-slate-500 text-sm">Check back later for new assignments</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Daily Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Report Submission */}
                        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 border-b border-slate-800/50">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold text-white">Submit Report</h2>
                                        <p className="text-slate-400">Daily work report</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleReportSubmit} className="p-6 space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Select Job
                                        </label>
                                        <select
                                            value={reportForm.job_id}
                                            onChange={(e) => setReportForm({ ...reportForm, job_id: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                                            required
                                        >
                                            <option value="">Choose a job...</option>
                                            {jobs.map((job) => (
                                                <option key={job.id} value={job.id} className="bg-slate-800">
                                                    {job.job_name} - {job.target_parts} parts
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Report Date
                                        </label>
                                        <input
                                            type="date"
                                            value={reportForm.report_date}
                                            onChange={(e) => setReportForm({ ...reportForm, report_date: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Staff Number
                                        </label>
                                        <input
                                            type="text"
                                            value={reportForm.staff_number}
                                            onChange={(e) => setReportForm({ ...reportForm, staff_number: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                                            placeholder="Enter staff number"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Report Details
                                        </label>
                                        <textarea
                                            value={reportForm.report_text}
                                            onChange={(e) => setReportForm({ ...reportForm, report_text: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 resize-none"
                                            rows="5"
                                            placeholder="Enter your daily report details..."
                                            required
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={`px-6 py-4 rounded-xl backdrop-blur-sm border ${message.includes('success') || message.includes('successfully')
                                        ? 'bg-emerald-900/20 text-emerald-300 border-emerald-600/50'
                                        : 'bg-rose-900/20 text-rose-300 border-rose-600/50'
                                        }`}>
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Submitting...
                                        </div>
                                    ) : (
                                        'Submit Report'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Document Upload */}
                        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 p-6 border-b border-slate-800/50">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                                        <p className="text-slate-400">Submit files and screenshots</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleFileUpload} className="p-6 space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Select Job
                                        </label>
                                        <select
                                            value={uploadForm.job_id}
                                            onChange={(e) => setUploadForm({ ...uploadForm, job_id: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                                            required
                                        >
                                            <option value="">Choose a job...</option>
                                            {jobs.map((job) => (
                                                <option key={job.id} value={job.id} className="bg-slate-800">
                                                    {job.job_name} - {job.target_parts} parts
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Upload Date
                                        </label>
                                        <input
                                            type="date"
                                            value={uploadForm.report_date}
                                            onChange={(e) => setUploadForm({ ...uploadForm, report_date: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Document Description
                                        </label>
                                        <textarea
                                            value={uploadForm.report_text}
                                            onChange={(e) => setUploadForm({ ...uploadForm, report_text: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300 resize-none"
                                            rows="3"
                                            placeholder="Describe the document you're uploading..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                                            Select File
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                                className="hidden"
                                                id="fileInput"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                                required
                                            />
                                            <label
                                                htmlFor="fileInput"
                                                className="w-full px-4 py-8 bg-slate-800/40 border-2 border-dashed border-slate-600/50 rounded-xl text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-slate-700/40 transition-all duration-300 cursor-pointer flex items-center justify-center"
                                            >
                                                <div className="text-center">
                                                    <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                                                        <Upload className="w-8 h-8 text-orange-400" />
                                                    </div>
                                                    <p className="font-semibold text-lg mb-1">
                                                        {uploadForm.file ? uploadForm.file.name : 'Click to upload file'}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        PDF, DOC, JPG, PNG, TXT (Max 10MB)
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Uploading...
                                        </div>
                                    ) : (
                                        'Upload Document'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* My Reports History */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 border-b border-slate-800/50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                    <div className="flex items-center">
                                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-2xl font-bold text-white">My Reports History</h2>
                                            <p className="text-slate-400">View submitted reports</p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-500/30">
                                        {myReports.length} Reports
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {myReports.length > 0 ? (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {myReports.map((report, index) => (
                                            <div key={report.id || index} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white text-lg mb-2">{report.job_name}</h4>
                                                        <p className="text-slate-400 text-sm">Staff: {report.staff_number}</p>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-emerald-400 text-sm font-semibold">
                                                            {report.submission_date ? new Date(report.submission_date).toLocaleDateString() : 'Today'}
                                                        </p>
                                                        <p className="text-slate-500 text-xs">
                                                            {report.submission_date ? new Date(report.submission_date).toLocaleTimeString() : 'Recent'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-800/60 rounded-lg p-4 mb-4 border border-slate-700/30">
                                                    <p className="text-slate-300 text-sm leading-relaxed">
                                                        {report.report_text}
                                                    </p>
                                                </div>

                                                {report.file_path && (
                                                    <div className="flex items-center text-blue-400 text-sm mb-4">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        <span>Document attached</span>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-700/50 space-y-2 sm:space-y-0">
                                                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            Report Date: {report.report_date}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-xs text-slate-500">
                                                        <Activity className="w-3 h-3 mr-1" />
                                                        Report #{index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                            <FileText className="w-10 h-10 text-slate-500" />
                                        </div>
                                        <p className="text-slate-400 text-xl font-medium mb-2">No reports submitted yet</p>
                                        <p className="text-slate-500 text-sm">Start submitting daily reports to track your progress</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        .animate-reverse {
          animation-direction: reverse;
        }
        
        /* Custom scrollbar for webkit browsers */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) rgba(51, 65, 85, 0.3);
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced hover effects */
        .group:hover .group-hover\\:shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        /* Glass effect enhancement */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px) saturate(180%);
        }
        
        /* Loading animation improvements */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        /* Focus improvements for better accessibility */
        input:focus, select:focus, textarea:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        /* Mobile responsive improvements */
        @media (max-width: 640px) {
          .text-2xl {
            font-size: 1.5rem;
          }
          
          .p-6 {
            padding: 1rem;
          }
          
          .p-8 {
            padding: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default EmployeeDashboard;
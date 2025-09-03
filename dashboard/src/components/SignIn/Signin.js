import React, { useState, useEffect } from 'react';
import { User, Lock, Briefcase, Clock, Target, Award, LogOut, Plus, Calendar, TrendingUp, Activity, Star, CheckCircle, AlertCircle, BarChart3, Zap, Users, Settings } from 'lucide-react';
import EmployeeDashboard from './Worker';

const API_BASE = 'https://cmti-edge.online/M2C/Backend/SignIn1.php';

const Signin = () => {
  const [userType, setUserType] = useState('admin');
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Job assignment form state
  const [jobForm, setJobForm] = useState({
    job_name: '',
    target_parts: '',
    cycle_time: '',
    quality_estimation: ''
  });

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedUserType = localStorage.getItem('userType');
    const savedEmployeeData = localStorage.getItem('employeeData');

    if (savedLogin === 'true') {
      setIsLoggedIn(true);
      setUserType(savedUserType || 'admin');
      if (savedEmployeeData) {
        setEmployeeData(JSON.parse(savedEmployeeData));
      }
      fetchJobs();
    }
  }, []);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}?api=true`, {
        credentials: 'include'
      });
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    if (userType === 'admin') {
      if (loginData.username === 'cmti.57@res.in' && loginData.password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'admin');
        setIsLoggedIn(true);
        setUserType('admin');
        await fetchJobs();
      } else {
        setLoginError('Invalid username or password');
      }
    } else {
      try {
        const response = await fetch(`${API_BASE}?api=true&action=employee_login&email=${loginData.username}&password=${loginData.password}`, {
          credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userType', 'employee');
          localStorage.setItem('employeeData', JSON.stringify(result.employee));
          setIsLoggedIn(true);
          setUserType('employee');
          setEmployeeData(result.employee);
          await fetchJobs();
        } else {
          setLoginError(result.error || 'Invalid credentials');
        }
      } catch (error) {
        setLoginError('Login failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('employeeData');
    setIsLoggedIn(false);
    setUserType('admin');
    setEmployeeData(null);
    setLoginData({ username: '', password: '' });
  };

  // Handle job form submission
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}?api=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobForm)
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Job assignment added successfully!');
        setJobForm({ job_name: '', target_parts: '', cycle_time: '', quality_estimation: '' });
        await fetchJobs();
      } else {
        setMessage('Failed to add job assignment');
      }
    } catch (error) {
      setMessage('Error adding job assignment');
    }
    setLoading(false);
  };

  // Calculate statistics
  const stats = {
    totalJobs: jobs.length,
    totalParts: jobs.reduce((sum, job) => sum + parseInt(job.target_parts || 0), 0),
    avgQuality: jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + parseInt(job.quality_estimation || 0), 0) / jobs.length) : 0,
    activeJobs: jobs.filter(job => job.status !== 'completed').length,
    completionRate: jobs.length > 0 ? Math.round((jobs.filter(job => job.status === 'completed').length / jobs.length) * 100) : 0
  };

  // Login Page Component
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-600/5 to-cyan-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="bg-gray-900/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/30 p-8 w-full max-w-md relative z-10 hover:bg-gray-900/30 transition-all duration-500">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-blue-500/20 opacity-75 blur-sm -z-10"></div>
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-gray-900/90 to-black/90 -z-10"></div>

          {/* User Type Selector */}
          <div className="flex mb-8 bg-gray-800/30 rounded-2xl p-1 backdrop-blur-sm border border-gray-700/30">
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${userType === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setUserType('employee')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${userType === 'employee'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
            >
              Employee
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/20">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
              Job Management
            </h1>
            <p className="text-gray-400 text-lg">Advanced Control System</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
              <input
                type="email"
                placeholder={userType === 'admin' ? "Admin Email" : "Employee Email"}
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {loginError}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'Signing In...' : 'Access Dashboard'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 text-center">
            <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-2">
                {userType === 'admin' ? 'Demo Admin:' : 'Demo Employee:'}
              </p>
              <div className="space-y-1">
                {userType === 'admin' ? (
                  <>
                    <p className="text-purple-300 font-mono text-sm">cmti.57@res.in</p>
                    <p className="text-cyan-300 font-mono text-sm">admin</p>
                  </>
                ) : (
                  <>
                    <p className="text-purple-300 font-mono text-sm">employee@cmti.res.in</p>
                    <p className="text-cyan-300 font-mono text-sm">Emp@123</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Component
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-600/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600/3 to-purple-600/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/40 backdrop-blur-xl border-b border-gray-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl w-12 h-12 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {userType === 'admin' ? 'Job Management Dashboard' : 'Employee Portal'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {userType === 'admin' ? 'Advanced Control Center' : `Welcome, ${employeeData?.employee_name || 'Employee'}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-800/30 rounded-xl px-4 py-2 backdrop-blur-sm border border-gray-700/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-gray-400 hover:text-red-400 transition-all duration-300 bg-gray-800/30 hover:bg-red-900/20 rounded-xl border border-gray-700/30 hover:border-red-500/30 backdrop-blur-sm group"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="col-span-2 lg:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Jobs</p>
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">{stats.totalJobs}</p>
              </div>
              <div className="bg-purple-500/20 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-purple-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Active</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Quality Score</p>
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{stats.avgQuality}%</p>
              </div>
              <div className="bg-emerald-500/20 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Excellent</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Parts</p>
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{stats.totalParts}</p>
              </div>
              <div className="bg-blue-500/20 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-300">
              <Activity className="w-3 h-3 mr-1" />
              <span>In Progress</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Efficiency</p>
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">92%</p>
              </div>
              <div className="bg-orange-500/20 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-orange-300">
              <BarChart3 className="w-3 h-3 mr-1" />
              <span>High Performance</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Team Size</p>
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">12</p>
              </div>
              <div className="bg-cyan-500/20 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors duration-300">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-cyan-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Job Assignment Form - Only for Admin */}
          {userType === 'admin' && (
            <div className="xl:col-span-1 bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/30 overflow-hidden hover:bg-gray-900/50 transition-all duration-500 group">
              <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 px-6 sm:px-8 py-6 border-b border-gray-700/30">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">New Assignment</h2>
                    <p className="text-gray-400 text-sm">Create job assignments</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleJobSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Job Name</label>
                    <Briefcase className="absolute left-4 top-12 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                    <input
                      type="text"
                      value={jobForm.job_name}
                      onChange={(e) => setJobForm({ ...jobForm, job_name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                      placeholder="Enter job name"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Target Parts</label>
                    <Target className="absolute left-4 top-12 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                    <input
                      type="number"
                      value={jobForm.target_parts}
                      onChange={(e) => setJobForm({ ...jobForm, target_parts: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                      placeholder="Enter target parts"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Cycle Time (mins)</label>
                    <Clock className="absolute left-4 top-12 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                    <input
                      type="number"
                      step="0.01"
                      value={jobForm.cycle_time}
                      onChange={(e) => setJobForm({ ...jobForm, cycle_time: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                      placeholder="Enter cycle time"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Quality Estimation</label>
                    <Award className="absolute left-4 top-12 w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors duration-300" />
                    <input
                      type="number"
                      value={jobForm.quality_estimation}
                      onChange={(e) => setJobForm({ ...jobForm, quality_estimation: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-600/40 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60"
                      placeholder="Enter good parts count"
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className={`px-6 py-4 rounded-xl backdrop-blur-sm animate-fade-in flex items-center ${message.includes('success')
                      ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-600/50'
                      : 'bg-red-900/30 text-red-300 border border-red-600/50'
                    }`}>
                    {message.includes('success') ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Assignment
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          )}

          {/* Jobs Overview - Takes remaining space */}
          {userType === 'admin' && (
            <div className={`${userType === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'} bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/30 overflow-hidden hover:bg-gray-900/50 transition-all duration-500`}>
            <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 px-6 sm:px-8 py-6 border-b border-gray-700/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center mr-4 shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Job Overview</h2>
                    <p className="text-gray-400 text-sm">Monitor all assignments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
                    {jobs.length} Active
                  </div>
                  <button className="p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-300 border border-gray-600/30">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {jobs.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {jobs.map((job, index) => (
                    <div key={job.id || index} className="bg-gray-800/40 rounded-2xl p-6 border border-gray-600/30 hover:bg-gray-800/60 transition-all duration-300 group backdrop-blur-sm">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors duration-300 line-clamp-1">
                              {job.job_name}
                            </h4>
                            <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg text-xs font-medium border border-emerald-500/30 ml-2">
                              Active
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-400 bg-gray-700/20 rounded-lg px-3 py-2">
                              <Target className="w-4 h-4 mr-2 text-blue-400" />
                              <span className="font-medium">{job.target_parts}</span>
                              <span className="ml-1 text-xs">parts</span>
                            </div>
                            <div className="flex items-center text-gray-400 bg-gray-700/20 rounded-lg px-3 py-2">
                              <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                              <span className="font-medium">{job.cycle_time}</span>
                              <span className="ml-1 text-xs">mins</span>
                            </div>
                            <div className="flex items-center text-gray-400 bg-gray-700/20 rounded-lg px-3 py-2">
                              <Award className="w-4 h-4 mr-2 text-orange-400" />
                              <span className="font-medium">{job.quality_estimation}</span>
                              <span className="ml-1 text-xs">good</span>
                            </div>
                            <div className="flex items-center text-gray-400 bg-gray-700/20 rounded-lg px-3 py-2">
                              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                              <span className="font-medium text-xs">
                                {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Today'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-400 font-medium">Processing</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="bg-gray-700/30 px-2 py-1 rounded text-xs">#{String(index + 1).padStart(3, '0')}</span>
                          </div>
                          <div className="w-full bg-gray-700/30 rounded-full h-2 mt-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (parseInt(job.quality_estimation || 0) / parseInt(job.target_parts || 1)) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {Math.min(100, Math.round((parseInt(job.quality_estimation || 0) / parseInt(job.target_parts || 1)) * 100))}% Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-gray-400 text-xl mb-2 font-medium">No Jobs Available</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                    {userType === 'admin' 
                      ? "Start by creating your first job assignment using the form on the left." 
                      : "No jobs have been assigned to you yet. Check back later or contact your administrator."
                    }
                  </p>
                  {userType === 'admin' && (
                    <div className="mt-6">
                      <div className="inline-flex items-center text-sm text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Use the form to create your first assignment
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
          
        </div>

        {/* Additional Quick Actions - Only for Admin */}
        {userType === 'admin' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">Analytics</p>
                  <p className="text-sm text-gray-400">View Reports</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Comprehensive performance metrics and insights</p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">Team</p>
                  <p className="text-sm text-gray-400">Manage Staff</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Employee management and team coordination</p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl w-12 h-12 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">Settings</p>
                  <p className="text-sm text-gray-400">System Config</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Configure system preferences and options</p>
            </div>
          </div>
        )}
        {/* Employee Dashboard */}
        {userType === 'employee' && (
          <div className="mt-8">
            <EmployeeDashboard
              employeeData={employeeData}
              userType={userType}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.5), rgba(34, 211, 238, 0.5));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.8), rgba(34, 211, 238, 0.8));
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        /* Mobile responsiveness improvements */
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 640px) and (max-width: 1024px) {
          .lg\\:grid-cols-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Signin;
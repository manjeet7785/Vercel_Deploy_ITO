import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { leadService } from '../../services/leadService';
import { FiUsers, FiAlertCircle, FiFileText, FiPhoneCall, FiTruck, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, pipelineRes, performanceRes] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getPipeline(),
        adminService.getEmployeePerformance()
      ]);

      if (summaryRes.success) setSummary(summaryRes.data.summary);
      if (pipelineRes.success) setPipeline(pipelineRes.data.pipeline);
      if (performanceRes.success) setPerformance(performanceRes.data.performance);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Users', value: summary?.users || 0, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Active Users', value: summary?.activeUsers || 0, icon: FiUsers, color: 'bg-green-500' },
    { title: 'Open Alerts', value: summary?.openAlerts || 0, icon: FiAlertCircle, color: 'bg-red-500' },
    { title: 'Pending Quotations', value: summary?.pendingQuotations || 0, icon: FiFileText, color: 'bg-yellow-500' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Pipeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" />
              <Bar dataKey="won" fill="#10b981" name="Won" />
              <Bar dataKey="lost" fill="#ef4444" name="Lost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stage Distribution */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Stage Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summary?.stageCounts && Object.entries(summary.stageCounts).map(([stage, count], index) => (
            <div key={stage} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 mt-1">{stage.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
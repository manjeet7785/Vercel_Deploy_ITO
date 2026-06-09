import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiBarChart2, FiSettings, FiUserCheck, FiAlertCircle, FiFileText, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [summaryRes, usersRes, alertsRes, pipelineRes] = await Promise.all([
        api.get('/admin/dashboard/summary'),
        api.get('/admin/users'),
        api.get('/security/alerts'),
        api.get('/admin/dashboard/pipeline')
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data.summary);
      if (usersRes.data.success) setUsers(usersRes.data.data.users);
      if (alertsRes.data.success) setAlerts(alertsRes.data.data.alerts);
      if (pipelineRes.data.success) setPipeline(pipelineRes.data.data.pipeline);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        const response = await api.patch(`/admin/users/${userId}/deactivate`);
        if (response.data.success) {
          toast.success('User deactivated successfully');
          fetchAdminData();
        }
      } catch (error) {
        console.error('Error deactivating user:', error);
        toast.error('Failed to deactivate user');
      }
    }
  };

  const activateUser = async (userId) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/activate`);
      if (response.data.success) {
        toast.success('User activated successfully');
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const response = await api.patch(`/security/alerts/${alertId}/resolve`);
      if (response.data.success) {
        toast.success('Alert resolved');
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">System administration and monitoring</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Admin Access
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.users || 0}</p>
            </div>
            <FiUsers className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{summary?.activeUsers || 0}</p>
            </div>
            <FiUserCheck className="text-green-500" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Alerts</p>
              <p className="text-2xl font-bold text-red-600">{summary?.openAlerts || 0}</p>
            </div>
            <FiAlertCircle className="text-red-500" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Quotations</p>
              <p className="text-2xl font-bold text-yellow-600">{summary?.pendingQuotations || 0}</p>
            </div>
            <FiFileText className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiBarChart2 className="inline mr-2" size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiUsers className="inline mr-2" size={16} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiShield className="inline mr-2" size={16} />
            Security Alerts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiSettings className="inline mr-2" size={16} />
            Settings
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Pipeline Chart */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Pipeline Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Distribution */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipeline}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, total }) => `${_id}: ${total}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="_id"
                >
                  {pipeline.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Employee ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{userItem.employeeId}</td>
                  <td className="py-3 px-4">{userItem.fullName}</td>
                  <td className="py-3 px-4">{userItem.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {userItem.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{userItem.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${userItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {userItem.isActive ? (
                      <button
                        onClick={() => deactivateUser(userItem._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activateUser(userItem._id)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{alert.alertType}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                      }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">{alert.message}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${alert.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                        alert.status === 'ACKNOWLEDGED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{new Date(alert.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {alert.status === 'OPEN' && (
                      <button
                        onClick={() => resolveAlert(alert._id)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                </div>
                <button className="btn-secondary">Enable</button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Backup Database</p>
                  <p className="text-sm text-gray-500">Create a backup of all data</p>
                </div>
                <button className="btn-primary">Backup Now</button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-sm text-gray-500">Clear application cache</p>
                </div>
                <button className="btn-secondary">Clear</button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-gray-500">Export all system data as JSON</p>
                </div>
                <button className="btn-secondary">Export</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
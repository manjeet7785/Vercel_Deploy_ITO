import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { FiPlus, FiSearch, FiEye, FiEdit2, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLead, setNewLead] = useState({
    customerName: '',
    phone: '',
    email: '',
    productCategory: '',
    quantity: '',
    destination: ''
  });

  const stages = ['NEW_LEAD', 'ASSIGNED', 'CONTACTED', 'QUOTATION_REQUIRED', 'QUOTATION_REQUESTED', 'QUOTATION_SHARED', 'DISPATCH_PLANNED', 'PAYMENT_PENDING', 'CLOSED_WON', 'CLOSED_LOST'];

  useEffect(() => {
    fetchLeads();
  }, [filterStage]);

  const fetchLeads = async () => {
    try {
      const params = filterStage ? { stage: filterStage } : {};
      const response = await leadService.getLeads(params);
      if (response.success) {
        setLeads(response.data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const response = await leadService.createLead(newLead);
      if (response.success) {
        toast.success('Lead created successfully');
        setShowCreateModal(false);
        setNewLead({ customerName: '', phone: '', email: '', productCategory: '', quantity: '', destination: '' });
        fetchLeads();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.leadCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage) => {
    const colors = {
      NEW_LEAD: 'bg-blue-100 text-blue-800',
      ASSIGNED: 'bg-indigo-100 text-indigo-800',
      CONTACTED: 'bg-purple-100 text-purple-800',
      QUOTATION_REQUIRED: 'bg-yellow-100 text-yellow-800',
      QUOTATION_REQUESTED: 'bg-orange-100 text-orange-800',
      QUOTATION_SHARED: 'bg-green-100 text-green-800',
      DISPATCH_PLANNED: 'bg-teal-100 text-teal-800',
      PAYMENT_PENDING: 'bg-red-100 text-red-800',
      CLOSED_WON: 'bg-emerald-100 text-emerald-800',
      CLOSED_LOST: 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage and track all your leads</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="w-64">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="input"
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Lead Code</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stage</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Created</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">Loading...</td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">No leads found</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{lead.leadCode}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{lead.customerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{lead.phoneMasked}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{lead.productCategory}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(lead.stage)}`}>
                      {lead.stage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/crm/leads/${lead._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <FiEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Lead</h2>
            <form onSubmit={handleCreateLead}>
              <div className="space-y-4">
                <div>
                  <label className="label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.customerName}
                    onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Product Category *</label>
                  <select
                    required
                    value={newLead.productCategory}
                    onChange={(e) => setNewLead({ ...newLead, productCategory: e.target.value })}
                    className="input"
                  >
                    <option value="">Select</option>
                    <option value="STONE">Stone</option>
                    <option value="COAL">Coal</option>
                    <option value="TEA">Tea</option>
                    <option value="RICE">Rice</option>
                  </select>
                </div>
                <div>
                  <label className="label">Quantity</label>
                  <input
                    type="text"
                    value={newLead.quantity}
                    onChange={(e) => setNewLead({ ...newLead, quantity: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Destination</label>
                  <input
                    type="text"
                    value={newLead.destination}
                    onChange={(e) => setNewLead({ ...newLead, destination: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="btn-primary flex-1">Create</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { quotationService } from '../../services/quotationService';
import { FiArrowLeft, FiActivity, FiFileText, FiTruck, FiDollarSign, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ note: '', actionType: 'FOLLOW_UP', nextFollowupAt: '' });
  const [quotationData, setQuotationData] = useState({ employeeRequestedPrice: '', paymentTerms: '', validityDays: 7 });

  const stages = ['NEW_LEAD', 'ASSIGNED', 'CONTACTED', 'QUOTATION_REQUIRED', 'QUOTATION_REQUESTED', 'QUOTATION_SHARED', 'DISPATCH_PLANNED', 'PAYMENT_PENDING', 'CLOSED_WON', 'CLOSED_LOST'];

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      const response = await leadService.getLeadById(id);
      if (response.success) {
        setLead(response.data.lead);
        setActivities(response.data.activities);
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage) => {
    try {
      const response = await leadService.updateStage(id, { newStage });
      if (response.success) {
        toast.success(`Stage updated to ${newStage.replace(/_/g, ' ')}`);
        fetchLeadDetails();
      }
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await leadService.addActivity(id, newActivity);
      if (response.success) {
        toast.success('Activity added successfully');
        setShowActivityModal(false);
        setNewActivity({ note: '', actionType: 'FOLLOW_UP', nextFollowupAt: '' });
        fetchLeadDetails();
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleRequestQuotation = async (e) => {
    e.preventDefault();
    try {
      const response = await quotationService.requestQuotation({ leadId: id, ...quotationData });
      if (response.success) {
        toast.success('Quotation requested successfully');
        setShowQuotationModal(false);
        setQuotationData({ employeeRequestedPrice: '', paymentTerms: '', validityDays: 7 });
        fetchLeadDetails();
      }
    } catch (error) {
      console.error('Error requesting quotation:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/crm/leads')} className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.customerName}</h1>
            <p className="text-gray-600">{lead.leadCode}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowQuotationModal(true)} className="btn-primary flex items-center space-x-2">
            <FiFileText size={18} />
            <span>Request Quotation</span>
          </button>
          <button onClick={() => setShowActivityModal(true)} className="btn-secondary flex items-center space-x-2">
            <FiActivity size={18} />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Lead Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600">Phone</p>
          <p className="text-lg font-semibold mt-1">{lead.phoneMasked || 'N/A'}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-semibold mt-1">{lead.emailMasked || 'N/A'}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Product</p>
          <p className="text-lg font-semibold mt-1">{lead.productCategory}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Quantity</p>
          <p className="text-lg font-semibold mt-1">{lead.quantity || 'N/A'}</p>
        </div>
      </div>

      {/* Stage Management */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage Management</h2>
        <div className="flex flex-wrap gap-2">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStageChange(stage)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${lead.stage === stage
                  ? getStageColor(stage) + ' ring-2 ring-offset-2 ring-primary-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {stage.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activities recorded yet</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{activity.actionType}</span>
                  <span className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-600">{activity.note}</p>
                {activity.nextFollowupAt && (
                  <p className="text-sm text-primary-600 mt-1">Next Follow-up: {new Date(activity.nextFollowupAt).toLocaleDateString()}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Activity</h2>
            <form onSubmit={handleAddActivity}>
              <div className="space-y-4">
                <div>
                  <label className="label">Activity Type</label>
                  <select
                    value={newActivity.actionType}
                    onChange={(e) => setNewActivity({ ...newActivity, actionType: e.target.value })}
                    className="input"
                  >
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="CALL">Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Meeting</option>
                    <option value="NOTE">Note</option>
                  </select>
                </div>
                <div>
                  <label className="label">Note</label>
                  <textarea
                    required
                    rows={3}
                    value={newActivity.note}
                    onChange={(e) => setNewActivity({ ...newActivity, note: e.target.value })}
                    className="input"
                    placeholder="Enter activity details..."
                  ></textarea>
                </div>
                <div>
                  <label className="label">Next Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={newActivity.nextFollowupAt}
                    onChange={(e) => setNewActivity({ ...newActivity, nextFollowupAt: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="btn-primary flex-1">Add</button>
                <button type="button" onClick={() => setShowActivityModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Quotation</h2>
            <form onSubmit={handleRequestQuotation}>
              <div className="space-y-4">
                <div>
                  <label className="label">Requested Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={quotationData.employeeRequestedPrice}
                    onChange={(e) => setQuotationData({ ...quotationData, employeeRequestedPrice: e.target.value })}
                    className="input"
                    placeholder="Enter requested price"
                  />
                </div>
                <div>
                  <label className="label">Payment Terms</label>
                  <input
                    type="text"
                    value={quotationData.paymentTerms}
                    onChange={(e) => setQuotationData({ ...quotationData, paymentTerms: e.target.value })}
                    className="input"
                    placeholder="e.g., 30% advance, 70% against documents"
                  />
                </div>
                <div>
                  <label className="label">Validity (Days)</label>
                  <input
                    type="number"
                    value={quotationData.validityDays}
                    onChange={(e) => setQuotationData({ ...quotationData, validityDays: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="btn-primary flex-1">Submit</button>
                <button type="button" onClick={() => setShowQuotationModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
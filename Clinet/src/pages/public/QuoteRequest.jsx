import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function QuoteRequest() {
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    phone: '',
    email: '',
    productCategory: '',
    quantity: '',
    destination: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await leadService.createLead(formData);
      if (response.success) {
        setSubmitted(true);
        toast.success('Quote request submitted successfully! Our team will contact you soon.');
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            customerName: '',
            companyName: '',
            phone: '',
            email: '',
            productCategory: '',
            quantity: '',
            destination: '',
            message: ''
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card text-center max-w-md mx-auto">
          <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600">Thank you for your interest. Our team will contact you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Request a Quote</h1>
        <p className="text-gray-600 mt-4">Fill out the form below and our team will get back to you with the best price</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="input"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="input"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Product Category *</label>
              <select
                required
                value={formData.productCategory}
                onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                className="input"
              >
                <option value="">Select a product</option>
                <option value="STONE">Natural Stones</option>
                <option value="COAL">Coal</option>
                <option value="TEA">Tea</option>
                <option value="RICE">Rice</option>
              </select>
            </div>
            <div>
              <label className="label">Quantity</label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input"
                placeholder="e.g., 100 tons, 5000 kg"
              />
            </div>
          </div>

          <div>
            <label className="label">Destination Port/City</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="input"
              placeholder="Enter destination port or city"
            />
          </div>

          <div>
            <label className="label">Additional Requirements</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="input"
              placeholder="Tell us more about your requirements, specifications, or any special requests..."
            ></textarea>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center space-x-2">
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiSend size={18} />
                <span>Submit Quote Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
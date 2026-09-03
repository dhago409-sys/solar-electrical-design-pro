import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types';

interface ProjectFormProps {
  onSubmit: (project: any) => void;
  onCancel: () => void;
}

function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    projectName: '',
    location: '',
    phone: '',
    email: '',
    designer: '',
    date: new Date().toISOString().split('T')[0],
    systemType: 'hybrid' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const systemTypes = ['off-grid', 'on-grid', 'hybrid', 'commercial', 'residential', 'industrial', 'solar-pump'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 mb-8 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
          <p className="text-gray-400 mb-8">Enter project details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-bold mb-4 text-solar-500">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter project name"
                  />
                  {errors.projectName && <p className="text-red-400 text-sm mt-1">{errors.projectName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter location"
                  />
                  {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-bold mb-4 text-solar-500">Project Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Designer</label>
                  <input
                    type="text"
                    name="designer"
                    value={formData.designer}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                    placeholder="Enter designer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">System Type</label>
                  <select
                    name="systemType"
                    value={formData.systemType}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-solar-500"
                  >
                    {systemTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-800">
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
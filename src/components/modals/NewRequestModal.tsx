import React, { useState, useRef } from 'react';
import { X, Calendar, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import SuccessCheckmark from '../animations/SuccessCheckmark';
import NewClientModal from './NewClientModal';
import { useCustomerStore } from '../../store/customerStore';
import { useRequestStore } from '../../store/requestStore';
import { syncNotesToClient } from '../../utils/notes';
import type { Request } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (requestId: string) => void;
}

export default function NewRequestModal({ isOpen, onClose, onSave }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const { addRequest } = useRequestStore();
  const { customers } = useCustomerStore();
  const [showCalendar, setShowCalendar] = useState<'primary' | 'secondary' | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    preferredDates: {
      primary: '',
      secondary: ''
    },
    preferredTimes: {
      anyTime: false,
      morning: false,
      afternoon: false,
      evening: false
    },
    requiresAssessment: false,
    internalNotes: '',
    linkTo: {
      clients: true,
      requests: true,
      invoices: true
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDateSelect = (date: string) => {
    if (showCalendar === 'primary') {
      setFormData(prev => ({
        ...prev,
        preferredDates: { ...prev.preferredDates, primary: date }
      }));
    } else if (showCalendar === 'secondary') {
      setFormData(prev => ({
        ...prev,
        preferredDates: { ...prev.preferredDates, secondary: date }
      }));
    }
    setShowCalendar(null);
  };

  const handleNewClientSave = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowNewClientModal(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId || showSuccess) return;

    // Sync internal notes to client if any
    if (formData.internalNotes.trim()) {
      syncNotesToClient(selectedClientId, formData.internalNotes, 'medium');
    }

    const newRequest: Request = {
      id: `r${Date.now()}`,
      clientId: selectedClientId,
      title: formData.title,
      details: formData.details,
      preferredDates: formData.preferredDates,
      preferredTimes: formData.preferredTimes,
      requiresAssessment: formData.requiresAssessment,
      internalNotes: formData.internalNotes,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addRequest(newRequest);
    setShowSuccess(true);
    
    // Just close after success animation
    setTimeout(() => {
      onSave?.(newRequest.id);
      onClose();
    }, 2000);
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const selectedClient = customers.find(c => c.id === clientId);
    
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        location: selectedClient.address,
        contactInfo: {
          name: selectedClient.name,
          email: selectedClient.email,
          phone: selectedClient.phone
        }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl relative text-white my-8">
        {showSuccess && <SuccessCheckmark message="Request created successfully!" />}

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-4">
                Request for
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                  value={selectedClientId}
                  onChange={(e) => {
                    if (e.target.value === 'new') {
                      setShowNewClientModal(true);
                    } else {
                      handleClientChange(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Client</option>
                  <option value="new">+ Add Client</option>
                  {customers.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Requested on {new Date().toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Request Title */}
          <div>
            <label className="block text-sm mb-2">Request title</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              value={formData.title}
              placeholder="Request title"
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="border-t border-gray-700 my-6"></div>

          {/* Service Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Details</h3>
            <label className="block text-sm mb-2">Please provide as much information as you can</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white min-h-[100px]"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              required
            />
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Availability</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Which day would be best for an assessment of the work?</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar('primary')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white cursor-pointer flex items-center justify-between relative">
                    <span>
                      {formData.preferredDates.primary 
                        ? formatDate(new Date(formData.preferredDates.primary))
                        : 'Select a date'}
                    </span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </button>
                  {showCalendar === 'primary' && (
                    <div className="absolute z-10 mt-2 bg-gray-800 rounded-lg shadow-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span>
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-sm text-gray-400 p-2">
                            {day}
                          </div>
                        ))}
                        {getDaysInMonth(currentMonth).map((date, i) => {
                          if (!date) return <div key={`empty-${i}`} />;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                              className={`p-2 rounded-lg text-sm ${
                                date < new Date() 
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : 'text-white hover:bg-gray-700'
                              }`}
                              disabled={date < new Date()}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">What is another day that works for you?</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(showCalendar === 'secondary' ? null : 'secondary')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white cursor-pointer flex items-center justify-between relative">
                    <span>
                      {formData.preferredDates.secondary 
                        ? formatDate(new Date(formData.preferredDates.secondary))
                        : 'Select a date'}
                    </span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </button>
                  {showCalendar === 'secondary' && (
                    <div className="absolute z-10 mt-2 bg-gray-800 rounded-lg shadow-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span>
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-sm text-gray-400 p-2">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                              disabled={date.toISOString().split('T')[0] < (formData.preferredDates.primary || '')}
                              className={`p-2 rounded-lg text-white text-sm ${
                                date.toISOString().split('T')[0] < (formData.preferredDates.primary || '')
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-700'
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">What are your preferred arrival times?</label>
                <div className="space-y-2">
                  {[
                    { key: 'anyTime', label: 'Any time' },
                    { key: 'morning', label: 'Morning - (8:00am-12:00pm)' },
                    { key: 'afternoon', label: 'Afternoon - (12:00pm-4:00pm)' },
                    { key: 'evening', label: 'Evening - (4:00pm-8:00pm)' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.preferredTimes[key as keyof typeof formData.preferredTimes]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          preferredTimes: {
                            ...prev.preferredTimes,
                            [key]: e.target.checked
                          }
                        }))}
                        className="form-checkbox bg-gray-800 border-gray-700"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-block w-10 h-6 rounded-full bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresAssessment}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requiresAssessment: e.target.checked
                }))}
                className="sr-only peer"
              />
              <span className="absolute inset-0 rounded-full transition peer-checked:bg-green-500" />
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition transform peer-checked:translate-x-4" />
            </label>
            <div>
              <div className="font-medium">On-site assessment required</div>
              <div className="text-sm text-gray-400">Schedule an assessment to collect more information before the job</div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Internal notes</h3>
            <p className="text-sm text-gray-400 mb-4">Internal notes will only be seen by your team</p>
            
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white min-h-[100px] mb-4"
              value={formData.internalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
            />

            <div 
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDragging ? 'border-green-500 bg-green-500/10' : 'border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-sm text-gray-400">
                  Drag your files here or{' '}
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-green-500 hover:text-green-400"
                  >
                    browse
                  </button>
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="text-sm mb-2 block">Link note to</label>
              <div className="flex gap-4">
                {['clients', 'requests', 'invoices'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.linkTo[type as keyof typeof formData.linkTo]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        linkTo: { ...prev.linkTo, [type]: e.target.checked }
                      }))}
                      className="form-checkbox bg-gray-700 border-gray-600"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg ${
              selectedClientId 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedClientId}
          >
            Create Request
          </button>
        </div>
      </div>
      
      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onSave={handleNewClientSave}
      />
    </div>
  );
}
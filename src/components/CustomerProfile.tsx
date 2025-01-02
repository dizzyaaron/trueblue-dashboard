import React, { useState } from 'react';
import { Phone, Mail, MapPin, Star, Clock, DollarSign, Wrench, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useJobStore } from '../store/jobStore';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

interface CustomerProfileProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    totalJobs: number;
    totalSpent: number;
    rating: number;
    joinDate: string;
    preferredServices: string[];
    notes: string;
  };
}

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  const { updateCustomer } = useCustomerStore();
  const { jobs } = useJobStore();
  const [newNote, setNewNote] = useState('');
  const [isNotesModified, setIsNotesModified] = useState(false);
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return JSON.parse(customer.notes || '[]');
    } catch {
      return [];
    }
  });
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    street: customer.address.split(',')[0] || '',
    city: customer.address.split(',')[1]?.trim() || '',
    state: customer.address.split(',')[2]?.trim() || '',
    zip: customer.address.split(',')[3]?.trim() || ''
  });

  const activeJob = jobs.find(job => job.customerId === customer.id && 
    ['pending', 'in-progress'].includes(job.status));

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
    setIsNotesModified(true);
  };

  const saveNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    updateCustomer(customer.id, { 
      notes: JSON.stringify(updatedNotes)
    });
    setNewNote('');
    setIsNotesModified(false);
  };

  const toggleNote = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const updateAddress = (field: keyof typeof address, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    updateCustomer(customer.id, {
      address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state}, ${newAddress.zip}`
    });
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-text dark:text-dark-text">
              {customer.name}
            </h2>
            {activeJob && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                activeJob.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {activeJob.status.charAt(0).toUpperCase() + activeJob.status.slice(1)}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Customer since {customer.joinDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-medium dark:text-dark-text">{customer.rating}/5</span>
          </div>
          <div className="relative">
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium mb-2 dark:text-dark-text">Recent Notes</h3>
              <div className="w-64 max-h-48 overflow-y-auto bg-white dark:bg-dark-background rounded-lg shadow-lg">
                {notes.slice().reverse().map((note) => (
                  <div 
                    key={note.id}
                    className="p-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => toggleNote(note.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(note.timestamp), 'MMM d, yyyy')}
                      </span>
                      {expandedNoteId === note.id ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </div>
                    <p className={`text-sm mt-1 ${
                      expandedNoteId === note.id ? '' : 'line-clamp-2'
                    } dark:text-dark-text`}>
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="dark:text-dark-text">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="dark:text-dark-text">{customer.email}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="font-medium dark:text-dark-text">Address</span>
            </div>
            <div className="grid grid-cols-1 gap-2 pl-8">
              <input
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                className="input-primary dark:bg-dark-background dark:text-dark-text"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  className="input-primary dark:bg-dark-background dark:text-dark-text"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    className="input-primary dark:bg-dark-background dark:text-dark-text"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={address.zip}
                    onChange={(e) => updateAddress('zip', e.target.value)}
                    className="input-primary dark:bg-dark-background dark:text-dark-text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-gray-400" />
            <span className="dark:text-dark-text">{customer.totalJobs} Total Jobs</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <span className="dark:text-dark-text">${customer.totalSpent.toLocaleString()} Lifetime Value</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="dark:text-dark-text">Last Service: 2 weeks ago</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2 dark:text-dark-text">Preferred Services</h3>
        <div className="flex flex-wrap gap-2">
          {customer.preferredServices.map((service) => (
            <span
              key={service}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm dark:bg-primary/20"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 relative">
        <h3 className="font-medium mb-2 dark:text-dark-text">Add Note</h3>
        <div className={`transition-all duration-300 ${isNotesModified ? 'mb-16' : ''}`}>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg bg-background dark:bg-dark-background dark:text-dark-text dark:border-gray-700"
            rows={4}
            value={newNote}
            onChange={handleNotesChange}
            placeholder="Enter a new note..."
          />
        </div>
        {isNotesModified && (
          <div className="absolute bottom-0 right-0 transform translate-y-full pt-4 animate-slide-up">
            <button
              onClick={saveNote}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
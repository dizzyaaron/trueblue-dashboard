import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Save, RefreshCcw } from 'lucide-react';
import StatusIndicator from '../StatusIndicator';
import { Request } from '../../types';
import { useCustomerStore } from '../../store/customerStore';
import { useRequestStore } from '../../store/requestStore';
import { useCapitalizedInput } from '../../hooks/useCapitalizedInput';
import { parseNotes, syncNotesToClient } from '../../utils/notes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: Request;
}

export default function RequestViewerModal({ isOpen, onClose, request }: Props) {
  const { customers } = useCustomerStore();
  const { updateRequest } = useRequestStore();
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, handleNoteChange, setNewNote] = useCapitalizedInput('');
  const [noteImportance, setNoteImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<Request['status']>(request.status);
  
  const customer = customers.find(c => c.id === request.clientId);
  const [notes, setNotes] = useState<Array<{
    id: string; 
    content: string; 
    timestamp: string;
    importance: 'low' | 'medium' | 'high';
  }>>([]);

  useEffect(() => {
    setNotes(parseNotes(request.internalNotes));
  }, [request.internalNotes]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    // Sync note to client
    const newNoteObj = syncNotesToClient(request.clientId, newNote, noteImportance);
    if (!newNoteObj) return;

    const updatedNotes = [
      ...notes,
      newNoteObj
    ];

    updateRequest(request.id, {
      internalNotes: JSON.stringify(updatedNotes)
    });
    
    // Update local state immediately
    setNotes(updatedNotes);
    setNewNote('');
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as Request['status']);
    updateRequest(request.id, { status: newStatus as Request['status'] });
  };
  const refreshNotes = () => {
    setNotes(parseNotes(request.internalNotes));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl relative text-white my-8">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{request.title}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-6 space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Name</label>
                  <p className="text-white">{customer?.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Phone</label>
                  <p className="text-white">{customer?.phone}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <p className="text-white">{customer?.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Address</label>
                  <p className="text-white">{customer?.address}</p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Request Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Assessment Required</label>
                  <p className="text-white">{request.requiresAssessment ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Description</label>
                  <p className="text-white whitespace-pre-wrap">{request.details}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Created At</label>
                  <p className="text-white">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400">Primary Date</label>
                    <p className="text-white">
                      {new Date(request.preferredDates.primary).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400">Secondary Date</label>
                    <p className="text-white">
                      {new Date(request.preferredDates.secondary).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Preferred Times</label>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(request.preferredTimes)
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <span key={key} className="px-2 py-1 bg-gray-800 rounded text-sm">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="flex items-center gap-4">
                <StatusIndicator status={status} />
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Panel */}
          <div className={`fixed top-0 right-0 bottom-0 bg-gray-800 w-96 transition-all duration-300 ease-in-out ${
            showNotes ? 'translate-x-0' : 'translate-x-full'
          } shadow-2xl`}>
            <div className="flex flex-col h-full relative">
              <div className="flex items-center justify-between p-6">
                <h3 className="text-lg font-semibold">Internal Notes</h3>
                <button
                  onClick={refreshNotes}
                  className="p-2 hover:bg-gray-700 rounded-full"
                  title="Refresh Notes"
                >
                  <RefreshCcw className="w-4 h-4 refresh-button" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 space-y-4">
                {notes.map((note: any) => (
                  <div 
                    key={note.id} 
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors relative"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                      note.importance === 'high' ? 'bg-red-500' :
                      note.importance === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <p className="text-white whitespace-pre-wrap">{note.content}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-700 mt-auto">
                <div className="flex gap-2 mb-2">
                  {['low', 'medium', 'high'].map((importance) => (
                    <button
                      key={importance}
                      onClick={() => setNoteImportance(importance as 'low' | 'medium' | 'high')}
                      className={`px-3 py-1 rounded-full text-xs ${
                        noteImportance === importance
                          ? importance === 'high' ? 'bg-red-500 text-white' :
                            importance === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {importance.charAt(0).toUpperCase() + importance.slice(1)}
                    </button>
                  ))}
                </div>
                <textarea
                  value={newNote}
                  onChange={handleNoteChange}
                  placeholder="Add a note..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Notes Toggle Button */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="absolute right-full top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-l-lg text-white hover:bg-gray-700"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
              showNotes ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
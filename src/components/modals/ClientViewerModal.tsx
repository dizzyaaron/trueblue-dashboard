import React, { useState } from 'react';
import { X, ChevronRight, Save, RefreshCcw } from 'lucide-react';
import { Customer } from '../../types';
import { useCapitalizedInput } from '../../hooks/useCapitalizedInput';
import { useCustomerStore } from '../../store/customerStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

export default function ClientViewerModal({ isOpen, onClose, customer }: Props) {
  const { updateCustomer } = useCustomerStore();
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, handleNoteChange, setNewNote] = useCapitalizedInput('');
  const [noteImportance, setNoteImportance] = useState<'low' | 'medium' | 'high'>('medium');
  
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(customer.notes || '[]');
    } catch (e) {
      console.error('Failed to parse notes:', e);
      return [];
    }
  });

  const refreshNotes = () => {
    try {
      const parsedNotes = Array.isArray(JSON.parse(customer.notes || '[]')) 
        ? JSON.parse(customer.notes || '[]')
        : [];
      setNotes(parsedNotes);
    } catch (e) {
      console.error('Failed to parse notes:', e);
      setNotes([]);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: new Date().toISOString(),
      importance: noteImportance
    };

    const updatedNotes = [...notes, newNoteObj];

    updateCustomer(customer.id, {
      notes: JSON.stringify(updatedNotes)
    });

    // Update local state immediately
    setNotes(updatedNotes);
    setNewNote('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl relative text-white my-8">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{customer.name}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-6 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="text-white">{customer.email}</p>
                    <span className="text-xs text-gray-400">(Primary)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Phone</label>
                  <div className="flex items-center gap-2">
                    <p className="text-white">{customer.phone}</p>
                    <label className="flex items-center gap-1">
                      <div className="relative inline-block w-10 h-6">
                        <input
                          type="checkbox"
                          checked={customer.receivesText}
                          onChange={(e) => updateCustomer(customer.id, { receivesText: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                      after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                      peer-checked:bg-green-600"></div>
                        <span className="ml-12 text-xs text-gray-400 whitespace-nowrap">Receives Texts</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400">Address</label>
                  <p className="text-white">{customer.address}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Client Since</label>
                  <p className="text-white">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {customer.lastContactDate && (
                  <div>
                    <label className="block text-sm text-gray-400">Last Contact</label>
                    <p className="text-white">
                      {new Date(customer.lastContactDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
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
                  onClick={() => {
                    refreshNotes();
                    // Add a subtle animation to the button
                    const button = document.querySelector('.refresh-button');
                    button?.classList.add('animate-spin');
                    setTimeout(() => button?.classList.remove('animate-spin'), 500);
                  }}
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
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors relative group"
                    onClick={() => {
                      // Handle note click
                      console.log('Note clicked:', note);
                    }}
                  >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                        note.importance === 'high' ? 'bg-red-500' :
                        note.importance === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <p className="text-white whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
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
  );
}
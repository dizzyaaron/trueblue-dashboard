import React, { useState } from 'react';
import { format } from 'date-fns';
import { Send, AlertCircle } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: string) => void;
}

export default function NotesSection({ notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setError('Note cannot be empty');
      return;
    }
    onAddNote(newNote.trim());
    setNewNote('');
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-dark-text">Notes</h3>
      
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={newNote}
              onChange={(e) => {
                setNewNote(e.target.value);
                setError(null);
              }}
              placeholder="Add a new note..."
              className="input-primary min-h-[100px] dark:bg-gray-700 dark:text-dark-text"
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={!newNote.trim()}
            >
              <Send className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <p className="text-gray-900 dark:text-dark-text whitespace-pre-wrap">
              {note.content}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
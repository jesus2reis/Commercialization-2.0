import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquare, Send } from 'lucide-react';

export interface Note {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey: string;
  pillarName: string;
  rangeName: string;
  countryName: string;
  onNotesChange?: () => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({ 
  isOpen, 
  onClose, 
  storageKey, 
  pillarName, 
  rangeName, 
  countryName,
  onNotesChange
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setMounted(true), 10);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setNotes(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse notes');
        }
      } else {
        setNotes([]);
      }
    } else {
      setMounted(false);
    }
  }, [isOpen, storageKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 300); // match duration
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      text: newNote.trim(),
      author: 'Current User', 
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
    setNewNote('');
    if (onNotesChange) {
      onNotesChange();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Notes · {pillarName} ({rangeName})</h2>
            <p className="text-xs text-slate-500 mt-1">Country: {countryName}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <MessageSquare size={48} className="opacity-20" />
              <p className="text-sm font-medium">No notes yet for this range.</p>
              <p className="text-xs">Add the first one below.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700">{note.author}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(note.createdAt).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{note.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer (Input) */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex flex-col gap-2">
            <textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              className="w-full text-sm resize-none border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#071b45]/20 focus:border-[#071b45] min-h-[80px]"
            />
            <button 
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#071b45] hover:bg-[#0a2766] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

import React, { useState, useEffect } from 'react';
import ArchiveToggleButton from './ArchiveToggleButton';

function MyNotesPage({ setCurrentPage }) {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('Loading notes...');
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://localhost:7139/NoteApp/getallnotes'; 

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true); 
        setMessage('Loading notes...');
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setNotes(data); 
        setMessage('');
      } catch (error) {
        console.error('Error Loading notes', error);
        setMessage(`Error loading notes ${error.message}. Checkbackend and endpoints '${API_BASE_URL}'.`);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteArchiveToggled = (noteId, newIsArchivedStatus) => {
    setNotes(prevNotes => {
      if (newIsArchivedStatus === true) {
        return prevNotes.filter(note => note.id !== noteId);
      } else {
        return prevNotes.map(note =>
            note.id === noteId ? { ...note, isArchived: newIsArchivedStatus } : note
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">My Notes</h2>
        {isLoading && <p className="text-center text-gray-600 mb-4">{message}</p>}
        {message && !isLoading && <p className="text-center text-red-600 mb-4">{message}</p>}

        {!isLoading && !message && notes.length === 0 && (
          <p className="text-center text-gray-600">Notes are empty. Create one!</p>
        )}

        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">{note.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{note.text}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {note.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(note.createdAt).toLocaleString()} | Last Updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
                
                <ArchiveToggleButton
                  noteId={note.id}
                  isArchived={note.isArchived}
                  onToggleSuccess={handleNoteArchiveToggled}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setCurrentPage('home')}
          className="mt-8 py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out w-full"
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default MyNotesPage;

import React, { useState, useEffect } from 'react';
import ArchiveToggleButton from './ArchiveToggleButton'; 

function ArchivedNotesPage({ setCurrentPage }) {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('Cargando notas archivadas...');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const API_BASE_URL = 'https://localhost:7139/NoteApp/allnotesnotarchive';

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      setIsLoading(true);
      setMessage('Cargando notas archivadas...');
      setFetchError(null);
      try {
        const response = await fetch(`${API_BASE_URL}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();
        setNotes(data);
        setMessage(''); 
      } catch (error) {
        console.error('Error al cargar notas archivadas:', error);
        setMessage('');
        setFetchError(`Error al cargar notas archivadas: ${error.message}. Verifica tu backend y el endpoint '${API_BASE_URL}/getallarchivednotes'.`);
        setNotes([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedNotes();
  }, []);

  const handleNoteUnarchived = (noteId, newIsArchivedStatus) => {
    setNotes(prevNotes => {
      if (newIsArchivedStatus === false) {
        return prevNotes.filter(note => note.id !== noteId);
      }
      return prevNotes.map(note =>
        note.id === noteId ? { ...note, isArchived: newIsArchivedStatus } : note
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Notas Archivadas</h2>

        {isLoading && <p className="text-center text-gray-600 mb-4">{message}</p>}
        {fetchError && <p className="text-center text-red-600 mb-4">{fetchError}</p>}

        {!isLoading && !fetchError && !message && notes.length === 0 && (
          <p className="text-center text-gray-600">No hay notas archivadas.</p>
        )}

        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
                <h3 className="text-xl font-semibold text-red-900 mb-2">{note.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{note.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Archivada: {new Date(note.createdAt).toLocaleString()} | Última Actualización: {new Date(note.updatedAt).toLocaleString()}
                </p>
                <ArchiveToggleButton
                  noteId={note.id}
                  isArchived={note.isArchived}
                  onToggleSuccess={handleNoteUnarchived}
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

export default ArchivedNotesPage;
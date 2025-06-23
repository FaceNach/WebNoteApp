import React, { useState, useEffect } from 'react';

const EditNotePage = ({setCurrentPage}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const API_BASE_URL_AllNotes = 'https://localhost:7139/NoteApp/getallnotes';
  const API_BASE_URL= 'https://localhost:7139/NoteApp';

  const MESSAGE_DISPLAY_DURATION = 3000;

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      const response = await fetch(API_BASE_URL_AllNotes);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Error loading notes", err);
      setError(`Couldnt load notes. Detalles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (note) => {
    setEditingNote({
      ...note,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingNote.title || !editingNote.text) {
      setError("Title and text can't be empty");
      return;
    }

    setMessage('');
    setError(null);
    try {
      const payload = {
        title: editingNote.title,
        text: editingNote.text,
        tags: editingNote.tags
          ? editingNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
          : []
      };

      const response = await fetch(`${API_BASE_URL}/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) { 
        const updatedNoteData = await response.json();
        setMessage(`Note: "${editingNote.title}" succesfully edited.`);
        setNotes(notes.map(note =>
          note.id === editingNote.id ? {
            ...note,
            title: updatedNoteData.title,
            text: updatedNoteData.text,
            tags: updatedNoteData.tags 
          } : note
        ));
        setEditingNote(null);
      } else if (response.status === 404) {
        setError(`Error: Note " ${editingNote.title}" not found.`);
      } else {
        const errorData = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorData || 'Unknown Error'}`);
      }
    } catch (err) {
      console.error("Error updating the note", err);
      setError(`NCouldnt update the note "${editingNote.title}". Details: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setError(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, MESSAGE_DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [message, MESSAGE_DISPLAY_DURATION]);

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100">
        <p className="text-lg text-gray-600">Loading Notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md max-w-lg w-full text-center">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={fetchNotes}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Retry loading notes...
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl relative">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Notes</h1>
        <button
          onClick={() => setCurrentPage('home')}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-sm"
          title="Home"
        >
          &#8592; Home
        </button>
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl relative">

        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">My Notes</h2>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 shadow-sm">
            <p>{message}</p>
          </div>
        )}

        {editingNote ? (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Edit Note</h3>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingNote.title || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">Text</label>
              <textarea
                id="text"
                name="text"
                value={editingNote.text || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Text"
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="tags" className="block text-gray-900 text-sm font-bold mb-2">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={editingNote.tags || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, mi tag"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">No hay notas para editar.</p>
            <button
              onClick={fetchNotes}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
            >
              Refrescar Notas
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm transition transform hover:scale-105 hover:shadow-md"
              >
                <div className="flex-grow pr-4 break-words">
                  <p className="text-xl font-semibold text-gray-900">{note.title || "Sin título"}</p>
                  <p className="text-lg text-gray-800 mt-1">{note.text || "Sin contenido"}</p>
                  {note.tags && note.tags.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Tags: {Array.isArray(note.tags) ? note.tags.join(', ') : note.tags}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleEditClick(note)}
                  className="px-5 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 shadow-md"
                  title={`Editar nota con ID: ${note.id}`}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditNotePage
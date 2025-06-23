import React, { useEffect, useState } from 'react';

const DeleteNotePage = ({setCurrentPage}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

 
  const API_BASE_URL_AllNotes = 'https://localhost:7139/NoteApp/getallnotes';
  const API_BASE_URL = 'https://localhost:7139/NoteApp';

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
      console.error("Error al cargar las notas:", err);
      setError(`Couldn't load notes. Details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    setMessage('');
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        setMessage(`Your note was succesfuly deleted`);
        setNotes(notes.filter(note => note.id !== id));
      } else if (response.status === 404) {
        setError(`Error: missmatch ID`);
      } else {
        const errorData = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorData || 'Unknown Error'}`);
      }
    } catch (err) {
      console.error("Error deleting the note", err);
      setError(`Couldn't delete the note. Details: ${err.message}`);
    }
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
      <div className="flex items-center justify-center p-8">
        <p className="text-lg text-gray-600">Loading Notes</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md max-w-lg w-full text-center">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchNotes}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Retry Loading Notes
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl relative">
      <button
        onClick={() => setCurrentPage('home')}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-sm"
        title="Back to HomePage"
      >
        &#8592; Home
      </button>

      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Your Notes</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 shadow-sm">
          <p>{message}</p>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">Your notes are empty</p>
          <button
            onClick={fetchNotes}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
          >
            Refresh Notes
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm transition transform hover:scale-105 hover:shadow-md"
            >
              <p className="text-lg text-gray-800 flex-grow pr-4 break-words">
                {note.content || note.text} 
              </p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="px-5 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 shadow-md"
                title={`Borrar nota con ID: ${note.id}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteNotePage
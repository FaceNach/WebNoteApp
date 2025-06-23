import React, { useState } from 'react';

function ArchiveToggleButton({ noteId, isArchived, onToggleSuccess }) {
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://localhost:7139/NoteApp';

  const handleToggle = async () => {
    setIsToggling(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/${noteId}/archive`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(!isArchived), 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to toggle archive status for ${noteId}. HTTP Error: ${response.status} - ${response.statusText}. Details: ${errorText}. URL: ${url}`);
      }

      onToggleSuccess(noteId, !isArchived);

    } catch (error) {
      console.error('Error toggling archive status:', error);
      setError(`Error updating status: ${error.message}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`mt-3 py-1 px-3 text-sm font-semibold rounded-lg shadow-md transition duration-200 ease-in-out w-full
          ${isArchived
            ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400'
            : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400' 
          }
          ${isToggling ? 'opacity-50 cursor-not-allowed' : ''} // Visual feedback when disabled
        `}
      >
        {isToggling ? 'Updating...' : (isArchived ? 'Unarchive' : 'Archive')}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
}

export default ArchiveToggleButton;
import React from "react";


function HomePage({ setCurrentPage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Welcome to NoteApp
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Organize your thoughts, capture your ideas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentPage('myNotes')}
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            My Notes
          </button>
          <button
            onClick={() => setCurrentPage('create')}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Create Note
          </button>
          <button
            onClick={() => setCurrentPage('edit')}
            className="w-full py-3 px-6 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Edit Note
          </button>
          <button
            onClick={() => setCurrentPage('delete')}
            className="w-full py-3 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Delete Note
          </button>
          <button
            onClick={() => setCurrentPage('archivedNotes')}
            className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition duration-200 ease-in-out"
          >
            Notas Archivadas
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
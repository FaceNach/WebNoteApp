import React, { useState } from 'react';

function NoteCreationForm({setCurrentPage}) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = 'https://localhost:7139/NoteApp';


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCurrentTagInputChange = (e) => {
    setCurrentTagInput(e.target.value);
  };

  const handleAddTag = () => {
    const tagToAdd = currentTagInput.trim();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd]);
      setCurrentTagInput(''); 
    }
  };

 
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearForm = () => {
    setTitle('');
    setText('');
    setTags([]);
    setCurrentTagInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!title.trim()) {
      setMessage('The title cant be empty');
      return;
    }

    setIsLoading(true);
    setMessage(''); 

    const now = new Date().toISOString();

    const newNote = {
      title: title,
      text: text,
      createdAt: now,
      updatedAt: now, 
      tags: tags, 
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || 'Error creating the note');
      }

      const data = await response.json();
      setMessage('Note created successfuly');
      console.log('Note:', data);
      clearForm(); 
      setCurrentPage('home')
    } catch (error) {
      console.error('Error loading the note', error);
      setMessage(`Error: ${error.message || 'Couldnt connect the server'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Create new note</h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded-xl text-center ${
            message.includes('éxito') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            placeholder="Write your title"
            maxLength="100"
          />
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y transition duration-150 ease-in-out"
            placeholder="Text goes here"
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (Max 10)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="tags"
              value={currentTagInput}
              onChange={handleCurrentTagInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="Add a tag and press - Add"
              disabled={tags.length >= 10}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 10 || !currentTagInput.trim()}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm transition duration-150 ease-in-out"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label={`X ${tag}`}
                >
                  <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Create'
          )}
        </button>
      </form>
      <button
        onClick={() => setCurrentPage('home')}
        className="mt-6 py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out w-full"
      >
        Home
      </button>
    </div>
  );
}

export default NoteCreationForm;
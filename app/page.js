"use client"
import React, { useState, useEffect } from 'react';

// Main Page component for Next.js
const Home = () => {
  // State to hold the list of notes
  // It initializes from localStorage or an empty array if no notes are found
  // Using a function for initial state to ensure it only runs once
  const [notes, setNotes] = useState(() => {
    // This check is important for Next.js to ensure localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    }
    return []; // Return empty array during server-side render
  });

  // State for the current note being added or edited
  const [currentNote, setCurrentNote] = useState('');
  // State to track if we are editing an existing note and which one
  const [editingNoteId, setEditingNoteId] = useState(null);
  // State for a message box to show user feedback (e.g., "Note added!")
  const [message, setMessage] = useState('');

  // New state to control the visibility of the category selection modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  // New state to temporarily hold the note text before category selection
  const [pendingNoteText, setPendingNoteText] = useState('');

  // Define the available categories
  const categories = ['Grocery', 'Amazon', 'Meesho', 'Myntra', 'Nayka'];

  // Define a mapping of categories to their specific Tailwind CSS color classes for the tags
  const categoryColors = {
    'Grocery': 'bg-green-600 text-white', // Darker background for tag, white text
    'Amazon': 'bg-orange-600 text-white', // Darker background for tag, white text
    'Meesho': 'bg-purple-600 text-white', // Darker background for tag, white text
    'Myntra': 'bg-rose-600 text-white',     // Darker background for tag, white text
    'Nayka': 'bg-pink-600 text-white',      // Darker background for tag, white text
  };

  // Define button colors for the modal, mapping to Tailwind classes
  // These will be used for the category selection buttons inside the popup
  const categoryButtonColors = {
    'Grocery': 'bg-green-700 hover:bg-green-800',
    'Amazon': 'bg-orange-700 hover:bg-orange-800',
    'Meesho': 'bg-purple-700 hover:bg-purple-800',
    'Myntra': 'bg-rose-700 hover:bg-rose-800',
    'Nayka': 'bg-pink-700 hover:bg-pink-800',
  };


  // useEffect hook to persist notes to localStorage whenever the notes state changes
  // This effect will only run on the client-side after the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Function to handle changes in the input field
  const handleInputChange = (e) => {
    setCurrentNote(e.target.value);
  };

  // Function to initiate adding a new note or updating an existing one
  const handleAddOrUpdateInitiate = () => {
    if (currentNote.trim() === '') {
      showMessage('Note cannot be empty!');
      return;
    }

    if (editingNoteId !== null) {
      // If editing, update the existing note's text directly
      setNotes(notes.map(note =>
        note.id === editingNoteId ? { ...note, text: currentNote } : note
      ));
      showMessage('Note updated successfully!');
      setEditingNoteId(null); // Exit editing mode
      setCurrentNote(''); // Clear the input field
    } else {
      // If adding a new note, store text and open category modal
      setPendingNoteText(currentNote.trim());
      setShowCategoryModal(true);
    }
  };

  // Function to handle category selection from the modal
  const handleCategorySelect = (category) => {
    const newNote = {
      id: Date.now(), // Unique ID using timestamp
      text: pendingNoteText,
      category: category, // Assign the selected category
      date: new Date().toLocaleString() // Timestamp for display
    };
    setNotes([...notes, newNote]);
    showMessage('Note added successfully!');
    setShowCategoryModal(false); // Close the modal
    setPendingNoteText(''); // Clear pending note text
    setCurrentNote(''); // Clear the input field
  };

  // Function to start editing an existing note
  const handleEditNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.text);
      setEditingNoteId(id); // Set the ID of the note being edited
      // Note: Editing only modifies text, not category in this flow
    }
  };

  // Function to delete a note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    showMessage('Note deleted successfully!');
  };

  // Function to display a temporary message in the message box
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000); // Message disappears after 3 seconds
  };

  return (
    // Main container for the app, styled with Tailwind CSS for centering and responsiveness
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-2xl w-full relative"> {/* Changed from gray-800 to gray-900 for main card */}
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          📝 My Notes
        </h1>

        {/* Message Box for feedback */}
        {message && (
          <div className="bg-gray-700 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg relative mb-6 text-center">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {/* Input area for adding/editing notes */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-gray-500 focus:border-gray-500 text-lg shadow-sm"
            placeholder="Type your note here..."
            value={currentNote}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddOrUpdateInitiate(); // Call initiate function
              }
            }}
          />
          <button
            onClick={handleAddOrUpdateInitiate} // Call initiate function
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            {editingNoteId ? 'Update Note' : 'Add Note'}
          </button>
        </div>

        {/* Category Selection Modal (Popup) */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"> {/* Increased opacity for modal background */}
            <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-sm w-full animate-fade-in-up"> {/* Changed from gray-800 to gray-900 for modal card */}
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Select a Category
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    // Dynamically apply button background color based on category
                    className={`text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-base ${categoryButtonColors[cat]}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="mt-6 w-full bg-neutral-700 hover:bg-neutral-600 text-gray-200 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List of notes */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center text-xl py-8">No notes yet. Start adding some!</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition duration-200"
              > {/* Changed from gray-700 to gray-800 for note background, border to gray-700 */}
                <div className="flex-grow mb-4 sm:mb-0">
                  <p className="text-gray-100 text-xl font-semibold mb-1">
                    {note.text}
                    {/* Display category if available, with dynamic color */}
                    {note.category && (
                      <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColors[note.category] || 'bg-gray-700 text-gray-300'}`}>
                        {note.category}
                      </span>
                    )}
                  </p>
                  <span className="text-gray-400 text-sm">{note.date}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditNote(note.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

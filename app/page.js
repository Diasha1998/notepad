"use client"
import React, { useState, useEffect } from 'react';
import TrueFocus from './animations/truefocus';
import TextPressure from './animations/textpressure';

const Home = () => {
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    }
    return []; 
  });

  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [message, setMessage] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [pendingNoteText, setPendingNoteText] = useState('');

  const categories = ['Grocery', 'Amazon', 'Meesho', 'Myntra', 'Nayka'];

  const categoryColors = {
    'Grocery': 'bg-green-600 text-white', 
    'Amazon': 'bg-orange-600 text-white', 
    'Meesho': 'bg-purple-600 text-white', 
    'Myntra': 'bg-rose-600 text-white',     
    'Nayka': 'bg-pink-600 text-white',      
  };

  const categoryButtonColors = {
    'Grocery': 'bg-green-700 hover:bg-green-800',
    'Amazon': 'bg-orange-700 hover:bg-orange-800',
    'Meesho': 'bg-purple-700 hover:bg-purple-800',
    'Myntra': 'bg-rose-700 hover:bg-rose-800',
    'Nayka': 'bg-pink-700 hover:bg-pink-800',
  };


  useEffect(() => {
    if (typeof window !== 'undefined') { 
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleInputChange = (e) => {
    setCurrentNote(e.target.value);
  };

  const handleAddOrUpdateInitiate = () => {
    if (currentNote.trim() === '') {
      showMessage('Note cannot be empty!');
      return;
    }

    if (editingNoteId !== null) {
      setNotes(notes.map(note =>
        note.id === editingNoteId ? { ...note, text: currentNote } : note
      ));
      showMessage('Note updated successfully!');
      setEditingNoteId(null); 
      setCurrentNote(''); 
    } else {
      setPendingNoteText(currentNote.trim());
      setShowCategoryModal(true);
    }
  };

  const handleCategorySelect = (category) => {
    const newNote = {
      id: Date.now(),
      text: pendingNoteText,
      category: category,
      date: new Date().toLocaleString() 
    };
    setNotes([...notes, newNote]);
    showMessage('Note added successfully!');
    setShowCategoryModal(false); 
    setPendingNoteText(''); 
    setCurrentNote(''); 
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.text);
      setEditingNoteId(id);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    showMessage('Note deleted successfully!');
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000); 
  };

  return (

    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-2xl w-full relative"> 
        {/* <TrueFocus
          sentence="Note App"
          manualMode={!1}
          blurAmount={5}
          borderColor="red"
          animationDuration={2}
          pauseBetweenAnimations={1} /> */}


        <div style={{ position: 'relative', height: '300px' }}>
          <TextPressure
            text="NOTES!"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={36}
          />
        </div>
        {/* <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          📝 My Notes
        </h1> */}

        {message && (
          <div className="bg-gray-700 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg relative mb-6 text-center">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-gray-500 focus:border-gray-500 text-lg shadow-sm"
            placeholder="Type your note here..."
            value={currentNote}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddOrUpdateInitiate(); 
              }
            }}
          />
          <button
            onClick={handleAddOrUpdateInitiate} 
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            {editingNoteId ? 'Update Note' : 'Add Note'}
          </button>
        </div>
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

        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center text-xl py-8">No notes yet. Start adding some!</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition duration-200"
              > 
                <div className="flex-grow mb-4 sm:mb-0">
                  <p className="text-gray-100 text-xl font-semibold mb-1">
                    {note.text}
                    
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

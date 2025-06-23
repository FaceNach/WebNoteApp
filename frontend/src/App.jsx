import { useState } from 'react'
import './App.css'
import HomePage from './components/Home'
import NoteCreationForm from './components/NoteCreationForm';
import MyNotesPage from './components/MyNotesPage';
import DeleteNotePage from './components/DeleteNotePage';
import EditNotePage from './components/EditNotePage';
import ArchivedNotesPage from './components/ArchivedNotesPage';

function App() {
  
  const [currentPage, setCurrentPage] = useState('home');

 
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'myNotes':
        return <MyNotesPage setCurrentPage={setCurrentPage} />;
      case 'create':
        return <NoteCreationForm setCurrentPage={setCurrentPage} />; 
      case 'edit':
        return <EditNotePage setCurrentPage={setCurrentPage} />; 
      case 'delete':
        return <DeleteNotePage setCurrentPage={setCurrentPage} />;
        case 'archivedNotes':
        return <ArchivedNotesPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-[#070738] flex justify-center items-center h-screen">
      {renderPage()}
    </div>
  );
}

export default App

using backend.Controllers;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public interface INoteAppService
    {
        public Task<IEnumerable<NoteAppDTOForFront>> GetAllNotes();
        public Task<NoteAppDTOForFront> GetNoteApp(Guid id);
        public Task<NoteAppDTOForFront> CreateNewNote(CreateNewNoteDTO createNewNoteDTO);
        public Task<bool> DeleteNoteApp(Guid id);
        public Task<NoteAppDTOForFront> UpdateNoteApp(Guid id, CreateNewNoteDTO createNewNoteDTO);
        Task<bool> SetNoteArchiveStatus(Guid id, bool isArchived);
       Task<IEnumerable<NoteAppDTOForFront>> GetAllArchivedNotes();
    }
}

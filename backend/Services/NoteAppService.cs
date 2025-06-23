using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Services
{
    public class NoteAppService : INoteAppService
    {
        private AddDbContext _context;

        public NoteAppService(AddDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NoteAppDTOForFront>> GetAllNotes()
        {

            var allNotes = await _context.NoteApps.Where(n => !n.IsArchived).ToListAsync();

            return allNotes.Select(noteApp => new NoteAppDTOForFront
            {
                Id = noteApp.Id,
                Title = noteApp.Title,
                Text = noteApp.Text,
                CreatedAt = noteApp.CreatedAt,
                UpdatedAt = noteApp.UpdatedAt,
                Tags = string.IsNullOrEmpty(noteApp.Tags)
                    ? Array.Empty<string>()
                    : noteApp.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                IsArchived = noteApp.IsArchived,
            }).ToList();
        }

        public async Task<NoteAppDTOForFront> GetNoteApp(Guid id)
        {
            var noteApp = await _context.NoteApps.FirstOrDefaultAsync(n => n.Id == id);

            if (noteApp == null)
            {
                return null;
            }

            return new NoteAppDTOForFront()
            {
                Title = noteApp.Title,
                Text = noteApp.Text,
                Tags = string.IsNullOrEmpty(noteApp.Tags) ? Array.Empty<string>() : noteApp.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                IsArchived = noteApp.IsArchived
            };
        }

        public async Task<NoteAppDTOForFront> CreateNewNote(CreateNewNoteDTO createNewNoteDTO)
        {
            var noteApp = new Models.NoteApp
            {
                Title = createNewNoteDTO.Title,
                Text = createNewNoteDTO.Text,
                CreatedAt = createNewNoteDTO.CreatedAt,
                UpdatedAt = createNewNoteDTO.UpdatedAt,
                Tags = string.Join(",", createNewNoteDTO.Tags ?? new string[0]),
                IsArchived = createNewNoteDTO.IsArchived
            };

            _context.NoteApps.Add(noteApp);

            await _context.SaveChangesAsync();

            var DTOForFront = new NoteAppDTOForFront
            {
                Id = noteApp.Id,
                Title = noteApp.Title,
                Text = noteApp.Text,
                CreatedAt = noteApp.CreatedAt,
                UpdatedAt = noteApp.UpdatedAt,
                Tags = string.IsNullOrEmpty(noteApp.Tags) ? Array.Empty<string>() : noteApp.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                IsArchived = noteApp.IsArchived
            };

            return DTOForFront;
        }

        public async Task<bool> DeleteNoteApp(Guid id)
        {
            var noteApp = await _context.NoteApps.FirstOrDefaultAsync(n => n.Id == id);

            if (noteApp == null)
            {
                return false;
            }

            _context.NoteApps.Remove(noteApp);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<NoteAppDTOForFront> UpdateNoteApp(Guid id, CreateNewNoteDTO createNewNoteDTO)
        {
            var noteApp = await _context.NoteApps.FirstOrDefaultAsync(n => n.Id == id);

            if (noteApp == null)
            {
                return null;
            }


            noteApp.Title = createNewNoteDTO.Title;
            noteApp.Text = createNewNoteDTO.Text;
            noteApp.UpdatedAt = new DateTime();
            noteApp.Tags = string.Join(",", createNewNoteDTO.Tags ?? new string[0]);

            await _context.SaveChangesAsync();

            var noteAppForFront = new NoteAppDTOForFront()
            {
                Id = noteApp.Id,
                Title = noteApp.Title,
                Text = noteApp.Text,
                CreatedAt = noteApp.CreatedAt,
                UpdatedAt = noteApp.UpdatedAt,
                Tags = string.IsNullOrEmpty(noteApp.Tags) ? Array.Empty<string>() : noteApp.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                IsArchived = noteApp.IsArchived
            };

            return noteAppForFront;
        }

        public async Task<bool> SetNoteArchiveStatus(Guid id, bool isArchived)
        {
            var noteApp = await _context.NoteApps.FirstOrDefaultAsync(n => n.Id == id);

            if (noteApp == null)
            {
                return false;
            }

            noteApp.IsArchived = isArchived;
            noteApp.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<NoteAppDTOForFront>> GetAllArchivedNotes()
        {
            var allArchivedNotes = await _context.NoteApps
                                                .Where(n => n.IsArchived)
                                                .ToListAsync();

            return allArchivedNotes.Select(noteApp => new NoteAppDTOForFront
            {
                Id = noteApp.Id,
                Title = noteApp.Title,
                Text = noteApp.Text,
                CreatedAt = noteApp.CreatedAt,
                UpdatedAt = noteApp.UpdatedAt,
                Tags = string.IsNullOrEmpty(noteApp.Tags) ? Array.Empty<string>() : noteApp.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                IsArchived = noteApp.IsArchived
            }).ToList();
        }
    
    }
}

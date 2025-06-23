using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Reflection.Metadata.Ecma335;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NoteApp : ControllerBase
    {
        private INoteAppService _noteAppService;

        public NoteApp(INoteAppService noteAppService, AddDbContext context )
        {
            _noteAppService = noteAppService;
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<NoteAppDTOForFront>> GetNoteApp(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteApp = await _noteAppService.GetNoteApp(id);

            if (noteApp == null)
            {
                return NotFound("The note doesn't exist");
            }

            return Ok(noteApp);
        }

        [HttpPost]
        public async Task<ActionResult<NoteAppDTOForFront>> CreateNewNote(CreateNewNoteDTO createNewNoteDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteApp = await _noteAppService.CreateNewNote(createNewNoteDTO);
           
            return Ok(noteApp);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNote(Guid id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteApp = await _noteAppService.DeleteNoteApp(id);

            if (!noteApp)
            {
                return NotFound("The note doesn't exist");
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<NoteAppDTOForFront>> UpdateNoteApp (Guid id, CreateNewNoteDTO createNewNoteDTO)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteAppForFront = await _noteAppService.UpdateNoteApp(id, createNewNoteDTO);

            if (noteAppForFront == null)
            {
                return NotFound();
            }

            return(Ok(noteAppForFront));
        }

        [HttpGet("getallnotes")]
        public async Task<ActionResult<IEnumerable<NoteAppDTOForFront>>> GetAllNotes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var allNotes = await _noteAppService.GetAllNotes();

            return Ok(allNotes);
        }


        [HttpPatch("{id}/archive")]
        public async Task<IActionResult> SetArchiveStatus(Guid id, [FromBody] bool isArchived)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _noteAppService.SetNoteArchiveStatus(id, isArchived);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("allnotesnotarchive")]
        public async Task<ActionResult<IEnumerable<NoteAppDTOForFront>>> GetAllArchiveNotes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var archivedNotes = await _noteAppService.GetAllArchivedNotes();
            
            return Ok(archivedNotes);
        }
    }
}

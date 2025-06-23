using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateNewNoteDTO
    {
        public Guid Id { get;}
        [Required(ErrorMessage = "You must put a title")]
        [StringLength(100, ErrorMessage = "You can't use more than 100 words")]
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [MaxLength(10, ErrorMessage = "You can't add more than 10 tags")]
        public string[] Tags { get; set; }

        public bool IsArchived { get; set; }
    }
}

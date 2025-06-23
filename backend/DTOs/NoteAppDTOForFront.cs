namespace backend.DTOs
{
    public class NoteAppDTOForFront
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string[] Tags {  get; set; }
        public bool IsArchived { get; set; }
    }
}

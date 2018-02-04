using System;
using System.ComponentModel.DataAnnotations;

namespace NotesAppReact.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTime Created { get; set; }

        public DateTime? Reminder { get; set; }
    }
}
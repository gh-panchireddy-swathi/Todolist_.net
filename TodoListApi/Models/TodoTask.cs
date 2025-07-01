using System;
using System.ComponentModel.DataAnnotations;

namespace TodoListApi.Models
{
    public class TodoTask
    {
        public int Id { get; set; }

        [Required]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsCompleted { get; set; }
        public string? Priority { get; set; } 

    }
}

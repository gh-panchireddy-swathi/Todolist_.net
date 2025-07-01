using Microsoft.AspNetCore.Mvc;
using TodoListApi.Data;
using TodoListApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TodoListApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetAll()
        {
            return await _context.TodoTasks.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTask>> GetById(int id)
        {
            var task = await _context.TodoTasks.FindAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public async Task<ActionResult<TodoTask>> Create(TodoTask task)
        {
            _context.TodoTasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TodoTask updatedTask)
        {
            if (id != updatedTask.Id) return BadRequest();
            _context.Entry(updatedTask).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.TodoTasks.FindAsync(id);
            if (task == null) return NotFound();
            _context.TodoTasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("complete/{id}")]
        public async Task<IActionResult> MarkComplete(int id)
        {
            var task = await _context.TodoTasks.FindAsync(id);
            if (task == null) return NotFound();
            task.IsCompleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

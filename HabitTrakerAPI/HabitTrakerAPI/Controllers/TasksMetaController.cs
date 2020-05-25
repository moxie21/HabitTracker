using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Entities;
using HabitTrakerAPI.Models;

namespace HabitTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksMetaController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public TasksMetaController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/TasksMeta
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TasksMeta>>> GetTasksMeta()
        {
            return await _context.TasksMeta.ToListAsync();
        }

        // GET: api/TasksMeta/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TasksMeta>> GetTasksMeta(int id)
        {
            var tasksMeta = await _context.TasksMeta.FindAsync(id);

            if (tasksMeta == null)
            {
                return NotFound();
            }

            return tasksMeta;
        }

        // PUT: api/TasksMeta/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTasksMeta(int id, TasksMeta tasksMeta)
        {
            if (id != tasksMeta.Id)
            {
                return BadRequest();
            }

            _context.Entry(tasksMeta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TasksMetaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TasksMeta
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<TasksMeta>> PostTasksMeta(TasksMeta tasksMeta)
        {
            _context.TasksMeta.Add(tasksMeta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTasksMeta", new { id = tasksMeta.Id }, tasksMeta);
        }

        // DELETE: api/TasksMeta/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TasksMeta>> DeleteTasksMeta(int id)
        {
            var tasksMeta = await _context.TasksMeta.FindAsync(id);
            if (tasksMeta == null)
            {
                return NotFound();
            }

            _context.TasksMeta.Remove(tasksMeta);
            await _context.SaveChangesAsync();

            return tasksMeta;
        }

        private bool TasksMetaExists(int id)
        {
            return _context.TasksMeta.Any(e => e.Id == id);
        }
    }
}

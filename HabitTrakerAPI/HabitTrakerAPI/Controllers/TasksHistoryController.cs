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
    public class TasksHistoryController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public TasksHistoryController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/TasksHistory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TasksHistory>>> GetTasksHistory()
        {
            return await _context.TasksHistory.ToListAsync();
        }

        // GET: api/TasksHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TasksHistory>> GetTasksHistory(int id)
        {
            var tasksHistory = await _context.TasksHistory.FindAsync(id);

            if (tasksHistory == null)
            {
                return NotFound();
            }

            return tasksHistory;
        }

        // PUT: api/TasksHistory/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTasksHistory(int id, TasksHistory tasksHistory)
        {
            if (id != tasksHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(tasksHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TasksHistoryExists(id))
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

        // POST: api/TasksHistory
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<TasksHistory>> PostTasksHistory([FromBody]TasksHistory tasksHistory)
        {
            _context.TasksHistory.Add(tasksHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTasksHistory", new { id = tasksHistory.Id }, tasksHistory);
        }

        // DELETE: api/TasksHistory/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TasksHistory>> DeleteTasksHistory(int id)
        {
            var tasksHistory = await _context.TasksHistory.FindAsync(id);
            if (tasksHistory == null)
            {
                return NotFound();
            }

            _context.TasksHistory.Remove(tasksHistory);
            await _context.SaveChangesAsync();

            return tasksHistory;
        }

        private bool TasksHistoryExists(int id)
        {
            return _context.TasksHistory.Any(e => e.Id == id);
        }
    }
}

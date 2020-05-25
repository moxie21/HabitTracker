using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Models;
using HabitTrakerAPI.Models;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;
using HabitTrackerAPI.Entities;

namespace HabitTrackerAPI.Controllers
{
    public class HabitResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HabitsController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public HabitsController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/Habits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitResult>>> GetHabits()
        {
            var userId = int.Parse(User.Identity.Name);

            var habits = _context.Habits
                .Where(s => s.UserId == userId)
                .Select(s => new HabitResult {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Color = s.Color
                });

            return await habits.ToListAsync();
        }

        // GET: api/Habits/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Habit>>> GetHabits(int userId)
        {
            var habits = await _context.Habits
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Name)
                .ToListAsync();

            if (habits == null)
            {
                return NotFound();
            }

            return habits;
        }

        // PUT: api/Habits/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHabit(int id, Habit habit)
        {
            if (id != habit.Id)
            {
                return BadRequest();
            }

            _context.Entry(habit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitExists(id))
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

        // POST: api/Habits
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Habit>> PostHabit([FromBody]Habit habit)
        {
            int userId = int.Parse(User.Identity.Name);

            if (habit.UserId != userId)
                return BadRequest();

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Habits/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Habit>> DeleteHabit(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            List<HabitsHistory> habitsHistoryToRemove = await _context.HabitsHistory.Where(s => s.HabitId == id).ToListAsync();

            if (habit == null)
            {
                return NotFound();
            }

            _context.HabitsHistory.RemoveRange(habitsHistoryToRemove);
            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HabitExists(int id)
        {
            return _context.Habits.Any(e => e.Id == id);
        }
    }
}

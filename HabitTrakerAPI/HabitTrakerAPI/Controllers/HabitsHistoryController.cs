using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Entities;
using HabitTrakerAPI.Models;
using HabitTrackerAPI.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.InteropServices.WindowsRuntime;

namespace HabitTrackerAPI.Controllers
{
    public class HabitHistoryResult
    {
        public int Id { get; set; }
        public int HabitId { get; set; }
        public DateTime Date { get; set; }
        public int Status { get; set; }
        public double Opacity { get; set; }
    }

    public class HabitHistoryAnnually
    {
        public DateTime Date { get; set; }
        public int Counter { get; set; }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HabitsHistoryController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public HabitsHistoryController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/HabitsHistory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitsHistory>>> GetHabitsHistory()
        {
            return await _context.HabitsHistory.ToListAsync();
        }

        // GET: api/HabitsHistory/annually
        [HttpGet("annually")]
        public ActionResult<IEnumerable<HabitHistoryAnnually>> GetHabitsAnnually()
        {
            int userId = int.Parse(User.Identity.Name);
            int year = DateTime.Now.Year;
            DateTime firstDay = new DateTime(year, 1, 1);
            DateTime lastDay = new DateTime(year, 12, 31);
            DateTime tempDate = firstDay;
            List<HabitHistoryAnnually> list = new List<HabitHistoryAnnually>();
            int index = 0;

            IQueryable<HabitHistoryAnnually> allHabits = _context.HabitsHistory
                .Where(s => s.Habit.UserId == userId & s.Date >= firstDay & s.Date <= lastDay & s.Status == 1)
                .GroupBy(s => s.Date)
                .OrderBy(s => s.Key)
                .Select(s => new HabitHistoryAnnually
                {
                    Date = s.Key,
                    Counter = s.Count()
                });

            HabitHistoryAnnually[] allHabitsArray = allHabits.ToArray();
            int len = allHabits.Count();

            while (DateTime.Compare(tempDate, lastDay) <= 0)
            {
                if (DateTime.Compare(tempDate, allHabitsArray[index].Date) == 0)
                {
                    list.Add(new HabitHistoryAnnually
                    {
                        Date = tempDate,
                        Counter = allHabitsArray[index].Counter
                    });
                    
                    if (index < len - 1) 
                        index++;
                }
                else
                {
                    list.Add(new HabitHistoryAnnually
                    {
                        Date = tempDate,
                        Counter = 0
                    });
                }

                tempDate = tempDate.AddDays(1);
            }

            return list;
        }

        [HttpGet("{startDate}/{endDate}")]
        public ActionResult<IEnumerable<HabitHistoryResult>> GetHabitsOnInterval(DateTime startDate, DateTime endDate)
        {
            int userId = int.Parse(User.Identity.Name);
            DateTime firstDate = startDate.AddDays(-6);
            DateTime tempDate = firstDate;
            double lastOpacity = 0.4;

            try
            {
                var allHabits = _context.HabitsHistory
                    .Where(s => s.Date >= firstDate & s.Date <= endDate & s.Habit.UserId == userId)
                    .OrderBy(s => s.HabitId)
                    .ThenBy(s => s.Date)
                    .Select(s => new HabitHistoryResult
                    {
                        Id = s.Id,
                        HabitId = s.HabitId,
                        Date = s.Date,
                        Status = s.Status,
                        Opacity = 0
                    }
                    );

                HabitHistoryResult firstEntry = allHabits.First();
                int lastId = firstEntry.HabitId;

                List<HabitHistoryResult> list = new List<HabitHistoryResult>();

                foreach (HabitHistoryResult row in allHabits)
                {
                    if (row.HabitId != lastId)
                    {
                        lastOpacity = 0.4;
                        tempDate = firstDate;
                    }

                    HabitHistoryResult temp = new HabitHistoryResult
                    {
                        Id = row.Id,
                        HabitId = row.HabitId,
                        Date = row.Date,
                        Status = row.Status
                    };

                    while (DateTime.Compare(tempDate, row.Date) < 0)
                    {
                        lastOpacity = 0.3;
                        tempDate = tempDate.AddDays(1);
                    }

                    if (lastOpacity < 1)
                    {
                        if (temp.Status == 2)
                        {
                            temp.Opacity = lastOpacity;
                        }
                        else
                        {
                            temp.Opacity = lastOpacity + 0.1;
                            lastOpacity += 0.1;
                        }
                    }
                    else
                    {
                        temp.Opacity = 1;
                    }

                    if (DateTime.Compare(startDate, row.Date) <= 0)
                        list.Add(temp);

                    lastId = row.HabitId;
                    tempDate = tempDate.AddDays(1);
                }

                return list;
            }
            catch (InvalidOperationException e)
            {
                return new List<HabitHistoryResult>();
            }
        }

        // GET: api/HabitsHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HabitsHistory>> GetHabitsHistory(int id)
        {
            var habitsHistory = await _context.HabitsHistory.FindAsync(id);

            if (habitsHistory == null)
            {
                return NotFound();
            }

            return habitsHistory;
        }

        // PUT: api/HabitsHistory/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHabitsHistory(int id, [FromBody]HabitsHistory habitsHistory)
        {
            if (id != habitsHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(habitsHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitsHistoryExists(id))
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

        // POST: api/HabitsHistory
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<HabitsHistory>> PostHabitsHistory([FromBody]HabitsHistory habitsHistory)
        {
            _context.HabitsHistory.Add(habitsHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHabitsHistory", new { id = habitsHistory.Id }, habitsHistory);
        }

        // DELETE: api/HabitsHistory/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<HabitsHistory>> DeleteHabitsHistory(int id)
        {
            var habitsHistory = await _context.HabitsHistory.FindAsync(id);
            if (habitsHistory == null)
            {
                return NotFound();
            }

            _context.HabitsHistory.Remove(habitsHistory);
            await _context.SaveChangesAsync();

            return habitsHistory;
        }

        private bool HabitsHistoryExists(int id)
        {
            return _context.HabitsHistory.Any(e => e.Id == id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Entities;
using HabitTrakerAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace HighlightTrackerAPI.Controllers
{
    public class HighlightHistoryResult
    {
        public int Id { get; set; }
        public int HighlightId { get; set; }
        public DateTime Date { get; set; }

    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HighlightsHistoryController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public HighlightsHistoryController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/HighlightsHistory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HighlightsHistory>>> GetHighlightsHistory()
        {
            return await _context.HighlightsHistory.ToListAsync();
        }

        // GET: api/HighlightsHistory/annually
        [HttpGet("annually")]
        public ActionResult<IEnumerable<HighlightHistoryResult>> GetHighlightsOnInterval()
        {
            int userId = int.Parse(User.Identity.Name);
            int year = DateTime.Now.Year;
            DateTime startDate = new DateTime(year, 1, 1);
            DateTime endDate = new DateTime(year, 12, 31);
            DateTime tempDate = startDate;

            try
            {
                var allHighlights = _context.HighlightsHistory
                    .Where(s => s.Date >= startDate & s.Date <= endDate & s.Highlight.UserId == userId)
                    .OrderBy(s => s.HighlightId)
                    .ThenBy(s => s.Date)
                    .Select(s => new HighlightHistoryResult
                    {
                        Id = s.Id,
                        HighlightId = s.HighlightId,
                        Date = s.Date
                    });

                HighlightHistoryResult firstEntry = allHighlights.First();
                int lastId = firstEntry.HighlightId;

                List<HighlightHistoryResult> list = new List<HighlightHistoryResult>();

                foreach (HighlightHistoryResult row in allHighlights)
                {
                    if (row.HighlightId != lastId)
                    {
                        tempDate = startDate;
                    }

                    HighlightHistoryResult temp = new HighlightHistoryResult
                    {
                        Id = row.Id,
                        HighlightId = row.HighlightId,
                        Date = row.Date
                    };


                    if (DateTime.Compare(startDate, row.Date) <= 0)
                        list.Add(temp);

                    lastId = row.HighlightId;
                    tempDate = tempDate.AddDays(1);
                }

                return list;
            }
            catch (InvalidOperationException e)
            {
                return new List<HighlightHistoryResult>();
            }
        }

        // GET: api/HighlightsHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HighlightsHistory>> GetHighlightsHistory(int id)
        {
            var highlightsHistory = await _context.HighlightsHistory.FindAsync(id);

            if (highlightsHistory == null)
            {
                return NotFound();
            }

            return highlightsHistory;
        }

        // PUT: api/HighlightsHistory/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHighlightsHistory(int id, HighlightsHistory highlightsHistory)
        {
            if (id != highlightsHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(highlightsHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HighlightsHistoryExists(id))
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

        // POST: api/HighlightsHistory
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<HighlightsHistory>> PostHighlightsHistory([FromBody]HighlightsHistory highlightsHistory)
        {
            _context.HighlightsHistory.Add(highlightsHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHighlightsHistory", new { id = highlightsHistory.Id }, highlightsHistory);
        }

        // DELETE: api/HighlightsHistory/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<HighlightsHistory>> DeleteHighlightsHistory(int id)
        {
            var highlightsHistory = await _context.HighlightsHistory.FindAsync(id);
            if (highlightsHistory == null)
            {
                return NotFound();
            }

            _context.HighlightsHistory.Remove(highlightsHistory);
            await _context.SaveChangesAsync();

            return highlightsHistory;
        }

        private bool HighlightsHistoryExists(int id)
        {
            return _context.HighlightsHistory.Any(e => e.Id == id);
        }
    }
}

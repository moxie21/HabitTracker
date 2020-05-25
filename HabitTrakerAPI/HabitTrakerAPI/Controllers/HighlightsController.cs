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

namespace HabitTrackerAPI.Controllers
{
    public class HighlightResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HighlightsController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public HighlightsController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/Highlights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HighlightResult>>> GetHighlights()
        {
            var userId = int.Parse(User.Identity.Name);

            var highlights = _context.Highlights
                .Where(s => s.UserId == userId)
                .Select(s => new HighlightResult
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Color = s.Color
                });

            return await highlights.ToListAsync();
        }

        // GET: api/Highlights/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Highlight>>> GetHighlights(int userId)
        {
            var highlights = await _context.Highlights
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Name)
                .ToListAsync();

            if (highlights == null)
            {
                return NotFound();
            }

            return highlights;
        }

        // PUT: api/Highlights/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHighlight(int id, Highlight highlight)
        {
            if (id != highlight.Id)
            {
                return BadRequest();
            }

            _context.Entry(highlight).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HighlightExists(id))
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

        // POST: api/Highlights
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Highlight>> PostHighlight([FromBody]Highlight highlight)
        {
            int userId = int.Parse(User.Identity.Name);

            if (highlight.UserId != userId)
                return BadRequest();

            _context.Highlights.Add(highlight);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Highlights/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Highlight>> DeleteHighlight(int id)
        {
            var highlight = await _context.Highlights.FindAsync(id);
            if (highlight == null)
            {
                return NotFound();
            }

            _context.Highlights.Remove(highlight);
            await _context.SaveChangesAsync();

            return highlight;
        }

        private bool HighlightExists(int id)
        {
            return _context.Highlights.Any(e => e.Id == id);
        }
    }
}

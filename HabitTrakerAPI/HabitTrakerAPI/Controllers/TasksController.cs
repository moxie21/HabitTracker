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
    public class TasksResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public string RepeatDay { get; set; }
        public string RepeatInterval { get; set; }
        public string RepeatMonth { get; set; }
        public string RepeatWeek { get; set; }
        public string RepeatWeekday { get; set; }
        public string RepeatYear { get; set; }
        public DateTime StartDate { get; set; }
        public int MetaId { get; set; }
        public int? HistoryId { get; set; }
    }

    public class TaskInsert
    {
        public bool Checked { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string RepeatDay { get; set; }
        public string RepeatInterval { get; set; }
        public string RepeatMonth { get; set; }
        public string RepeatWeek { get; set; }
        public string RepeatWeekday { get; set; }
        public string RepeatYear { get; set; }
        public DateTime StartDate { get; set; }
        public int UserId { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly HabitTrackerDBContext _context;

        public TasksController(HabitTrackerDBContext context)
        {
            _context = context;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tasks>>> GetTasks()
        {
            return await _context.Tasks.ToListAsync();
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tasks>> GetTasks(int id)
        {
            var tasks = await _context.Tasks.FindAsync(id);

            if (tasks == null)
            {
                return NotFound();
            }

            return tasks;
        }

        // GET: api/Tasks/startDate/endDate
        [HttpGet("{startDate}/{endDate}")]
        public IEnumerable<TasksResult> GetTasksOnInterval(DateTime startDate, DateTime endDate)
        {
            int userId = int.Parse(User.Identity.Name);
            DateTime tempDate = startDate;
            List<TasksResult> tasksList = new List<TasksResult>();
            IEnumerable<TasksResult> tempList = new List<TasksResult>();

            while (tempDate.CompareTo(endDate) != 1)
            {
                tempList = _context.TasksMeta
                    .Join(_context.Tasks,
                        s => s.TaskId,
                        task => task.Id,
                        (s, task) => new { Tasks = task, Meta = s }
                    )
                    .ToList()
                    .Where(s =>
                        {
                            int dateDiff = (tempDate - s.Meta.StartDate).Days;

                            if (s.Tasks.UserId != userId)
                                return false;
                            if (s.Meta.StartDate.CompareTo(tempDate) != 1 && Int32.TryParse(s.Meta.RepeatInterval, out int value) && dateDiff % value == 0)
                                return true;
                            if (isComplexRecurringValid(s.Meta, tempDate))
                                return true;

                            return false;
                        }
                    )
                    .OrderBy(s => s.Tasks.Id)
                    .Select(s =>
                        new TasksResult
                        {
                            Id = s.Tasks.Id,
                            Name = s.Tasks.Name,
                            Date = tempDate,
                            Description = s.Tasks.Description,
                            Status = 0,
                            HistoryId = null,
                            RepeatDay = s.Meta.RepeatDay,
                            RepeatInterval = s.Meta.RepeatInterval,
                            RepeatMonth = s.Meta.RepeatMonth,
                            RepeatWeek = s.Meta.RepeatWeek,
                            RepeatWeekday = s.Meta.RepeatWeekday,
                            RepeatYear = s.Meta.RepeatYear,
                            StartDate = s.Meta.StartDate,
                            MetaId = s.Meta.Id
                        }
                    );

                tasksList.AddRange(tempList);
                tempDate = tempDate.AddDays(1);
            }

            foreach (TasksResult task in tasksList)
            {
                var historyFound = _context.TasksHistory.FirstOrDefault(s => s.TaskId == task.Id & s.Date.CompareTo(task.Date) == 0);

                if (historyFound != null)
                {
                    task.HistoryId = historyFound.Id;
                    task.Status = 1;
                }
            }

            return tasksList.OrderBy(s => s.Id).ToList();
        }

        private bool isComplexRecurringValid(TasksMeta t, DateTime date)
        {
            if (t.StartDate.CompareTo(date) != 1 &&
                (Int32.TryParse(t.RepeatYear, out int year) && date.Year == year || (!String.IsNullOrEmpty(t.RepeatYear) && t.RepeatYear.Equals("*"))) &&
                (Int32.TryParse(t.RepeatMonth, out int month) && date.Month == month || (!String.IsNullOrEmpty(t.RepeatMonth) && t.RepeatMonth.Equals("*"))) &&
                (Int32.TryParse(t.RepeatDay, out int day) && date.Day == day || (!String.IsNullOrEmpty(t.RepeatDay) && t.RepeatDay.Equals("*"))) &&
                (Int32.TryParse(t.RepeatWeek, out int week) && GetWeekNumberOfMonth(date) == week || (!String.IsNullOrEmpty(t.RepeatWeek) && t.RepeatWeek.Equals("*"))) &&
                (Int32.TryParse(t.RepeatWeekday, out int weekDay) && (int)date.DayOfWeek == weekDay || (!String.IsNullOrEmpty(t.RepeatWeekday) && t.RepeatWeekday.Equals("*"))))
                return true;

            return false;
        }

        private int GetWeekNumberOfMonth(DateTime date)
        {
            date = date.Date;

            DateTime firstMonthDay = new DateTime(date.Year, date.Month, 1);
            DateTime firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);

            if (firstMonthMonday > date)
            {
                firstMonthDay = firstMonthDay.AddMonths(-1);
                firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
            }

            return (date - firstMonthMonday).Days / 7 + 1;
        }

        // PUT: api/Tasks/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTasks(int id, Tasks tasks)
        {
            if (id != tasks.Id)
            {
                return BadRequest();
            }

            _context.Entry(tasks).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TasksExists(id))
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

        // POST: api/Tasks
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Tasks>> PostTasks([FromBody]TaskInsert taskData)
        {
            int userId = int.Parse(User.Identity.Name);

            if (userId != taskData.UserId)
            {
                return BadRequest();
            }

            Tasks task = new Tasks(taskData.Name, taskData.Description, taskData.UserId);
            TasksMeta taskMeta;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            if (taskData.Checked)
            {
                taskMeta = new TasksMeta(taskData.StartDate, taskData.RepeatInterval, null, null, null, null, null, task.Id);
            }
            else
            {
                if (String.IsNullOrEmpty(taskData.RepeatYear))
                {
                    taskData.RepeatYear = "*";
                }
                if (String.IsNullOrEmpty(taskData.RepeatMonth))
                {
                    taskData.RepeatMonth = "*";
                }
                if (String.IsNullOrEmpty(taskData.RepeatDay))
                {
                    taskData.RepeatDay = "*";
                }
                if (String.IsNullOrEmpty(taskData.RepeatWeek))
                {
                    taskData.RepeatWeek = "*";
                }
                if (String.IsNullOrEmpty(taskData.RepeatWeekday))
                {
                    taskData.RepeatWeekday = "*";
                }

                taskMeta = new TasksMeta(taskData.StartDate, null, taskData.RepeatYear, taskData.RepeatMonth, taskData.RepeatDay, taskData.RepeatWeek, taskData.RepeatWeekday, task.Id);
            }

            _context.TasksMeta.Add(taskMeta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tasks>> DeleteTasks(int id)
        {
            var tasks = await _context.Tasks.FindAsync(id);
            List<TasksHistory> tasksHistoryToRemove = await _context.TasksHistory.Where(s => s.TaskId == id).ToListAsync();
            List<TasksMeta> tasksMetaToRemove = await _context.TasksMeta.Where(s => s.TaskId == id).ToListAsync();

            if (tasks == null)
            {
                return NotFound();
            }

            _context.TasksHistory.RemoveRange(tasksHistoryToRemove);
            _context.TasksMeta.RemoveRange(tasksMetaToRemove);
            _context.Tasks.Remove(tasks);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TasksExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }

        public static int? NullableTryParseInt32(string text)
        {
            int value;
            return int.TryParse(text, out value) ? (int?)value : null;
        }
    }
}

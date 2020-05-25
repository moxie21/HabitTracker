using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
    public class TasksMeta
    {
        private int repeatInterval;
        private int repeatYear;
        private int repeatMonth;
        private int repeatDay;
        private int repeatWeek;
        private int repeatWeekday;

        [Key]
        public int Id { get; set; }
        [Column(TypeName = "DateTime")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatInterval { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatYear { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatMonth { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatDay { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatWeek { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? RepeatWeekday { get; set; }


        public Tasks Task { get; set; }
        public int TaskId { get; set; }

        public TasksMeta(DateTime startDate, string repeatInterval, string repeatYear, string repeatMonth, string repeatDay, string repeatWeek, string repeatWeekday, int taskId)
        {
            StartDate = startDate;
            RepeatInterval = repeatInterval;
            RepeatYear = repeatYear;
            RepeatMonth = repeatMonth;
            RepeatDay = repeatDay;
            RepeatWeek = repeatWeek;
            RepeatWeekday = repeatWeekday;
            TaskId = taskId;
        }
    }
}

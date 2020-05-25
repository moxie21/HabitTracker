using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
    public class TasksHistory
    {
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "DateTime")]
		public DateTime Date { get; set; }

		public Tasks Task { get; set; }
		public int TaskId { get; set; }
	}
}

using HabitTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
	public class HabitsHistory
	{
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "DateTime")]
		public DateTime Date { get; set; }
		public int Status { get; set; }

		public Habit Habit { get; set; }
		public int HabitId { get; set; }
	}
}

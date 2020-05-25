using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
    public class Tasks
    {
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string Name { get; set; }
		[Column(TypeName = "nvarchar(255)")]
		public string Description { get; set; }

		public User User { get; set; }
		public int UserId { get; set; }
		public ICollection<TasksHistory> TasksHistory { get; set; }
		public ICollection<TasksMeta> TasksMeta { get; set; }

		public Tasks(string name, string description, int userId)
		{
			Name = name;
			Description = description;
			UserId = userId;
		}
	}
}

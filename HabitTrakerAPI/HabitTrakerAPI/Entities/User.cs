using HabitTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
	public class User
	{
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string FirstName { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string LastName { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string Email { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string Password { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string Country { get; set; }
		[Column(TypeName = "DateTime")]
		public DateTime? DateOfBirth { get; set; }
		[Column(TypeName = "nvarchar(20)")]
		public string Role { get; set; }
		[NotMapped]
		public string Token { get; set; }

		public ICollection<Habit> Habits { get; set; }
	}
}

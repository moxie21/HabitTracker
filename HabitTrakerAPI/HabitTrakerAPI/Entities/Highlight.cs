using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
    public class Highlight
    {
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "nvarchar(100)")]
		public string Name { get; set; }
		[Column(TypeName = "nvarchar(255)")]
		public string Description { get; set; }
		[Column(TypeName = "nvarchar(10)")]
		public string Color { get; set; }

		public User User { get; set; }
		public int UserId { get; set; }
		public ICollection<HighlightsHistory> HighlightsHistories { get; set; }
	}
}

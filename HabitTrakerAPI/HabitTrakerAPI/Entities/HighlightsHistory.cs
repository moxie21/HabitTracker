using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Entities
{
    public class HighlightsHistory
    {
		[Key]
		public int Id { get; set; }
		[Column(TypeName = "DateTime")]
		public DateTime Date { get; set; }

		public Highlight Highlight { get; set; }
		public int HighlightId { get; set; }
	}
}

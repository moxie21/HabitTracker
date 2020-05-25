using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HabitTrackerAPI.Models;
using HabitTrackerAPI.Entities;
using Tasks = HabitTrackerAPI.Entities.Tasks;

namespace HabitTrakerAPI.Models
{
	public class HabitTrackerDBContext : DbContext
	{
		public HabitTrackerDBContext(DbContextOptions<HabitTrackerDBContext> options) : base(options)
		{

		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{

		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{

		}

		public DbSet<User> Users { get; set; }
		public DbSet<Habit> Habits { get; set; }
		public DbSet<HabitsHistory> HabitsHistory { get; set; }
		public DbSet<Highlight> Highlights { get; set; }
		public DbSet<HighlightsHistory> HighlightsHistory { get; set; }
		public DbSet<Tasks> Tasks { get; set; }
		public DbSet<TasksHistory> TasksHistory { get; set; }
		public DbSet<TasksMeta> TasksMeta { get; set; }
	}
}

using HabitTrackerAPI.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Helpers
{
	public static class ExtensionMethods
	{
		public static User WithoutPassword(this User user)
		{
			if (user == null)
				return null;

			user.Password = null;

			return user;
		}

		public static IEnumerable<User> WithoutPasswords(this IEnumerable<User> users)
		{
			if (users == null)
				return Enumerable.Empty<User>();

			return users.Select(x => x.WithoutPassword());
		}
	}
}

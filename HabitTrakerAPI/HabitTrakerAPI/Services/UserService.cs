using HabitTrackerAPI.Entities;
using HabitTrackerAPI.Helpers;
using HabitTrakerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Services
{
	public interface IUserService
	{
		User Authenticate(string email, string password);
		IEnumerable<User> GetAll();
		User GetById(int id);
		Task<int> Register(User user);
	}

	public class UserService : IUserService
	{
		//private readonly List<User> _users = new List<User>
		//{
		//	new User { Id = 1, FirstName = "Raul", LastName = "Licaret", Email = "raul.licaret@cpp.canon", Password = "apollo14", Country = "Romania", DateOfBirth = new DateTime(1998, 10, 14), Role = Role.User },
		//	new User { Id = 2, FirstName = "Mara-Anca", LastName = "Chis", Email = "mery6@gmail.com", Password = "2112", Country = "Romania", DateOfBirth = new DateTime(1998, 11, 12), Role = Role.Admin }
		//};

		private readonly AppSettings _appSettings;
		public readonly HabitTrackerDBContext _context;

		public UserService(IOptions<AppSettings> appSettings, HabitTrackerDBContext context)
		{
			_appSettings = appSettings.Value;
			_context = context;
		}

		public User Authenticate(string email, string password)
		{
			var user = _context.Users.SingleOrDefault(x => x.Email == email && x.Password == password);

			if (user == null)
				return null;

			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					new Claim(ClaimTypes.Name, user.Id.ToString()),
					new Claim(ClaimTypes.Role, user.Role)
				}),
				Expires = DateTime.UtcNow.AddDays(7),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};
			var token = tokenHandler.CreateToken(tokenDescriptor);
			user.Token = tokenHandler.WriteToken(token);

			return user.WithoutPassword();
		}

		public IEnumerable<User> GetAll()
		{
			return _context.Users.WithoutPasswords();
		}

		public User GetById(int id)
		{
			var user = _context.Users.FirstOrDefault(x => x.Id == id);

			return user.WithoutPassword();
		}

		public async Task<int> Register(User user)
		{
			_context.Users.Add(user);
			return await _context.SaveChangesAsync();
		}
	}
}

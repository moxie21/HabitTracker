using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrakerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using HabitTrackerAPI.Models;
using HabitTrackerAPI.Services;
using HabitTrackerAPI.Entities;

namespace HabitTrackerAPI.Controllers
{
	[Authorize]
	[ApiController]
	[Route("[controller]")]
	public class UsersController : ControllerBase
	{
		private readonly IUserService _userService;

		public UsersController(IUserService userService)
		{
			_userService = userService;
		}

		[AllowAnonymous]
		[HttpPost("authenticate")]
		public IActionResult Authenticate([FromBody]AuthenticateModel model)
		{
			var user = _userService.Authenticate(model.Email, model.Password);

			if (user == null)
				return BadRequest(new { message = "Email or Password is incorrect" });

			return Ok(user);
		}

		[Authorize(Roles = Role.Admin)]
		[HttpGet]
		public IActionResult GetAll()
		{
			var users = _userService.GetAll();

			return Ok(users);
		}

		[HttpGet("{id}")]
		public IActionResult GetById(int id)
		{
			var currentUserId = int.Parse(User.Identity.Name);

			if (id != currentUserId && !User.IsInRole(Role.Admin))
				return Forbid();

			var user = _userService.GetById(id);

			if (user == null)
				return NotFound();

			return Ok(user);
		}

		[AllowAnonymous]
		[HttpPost("register")]
		public async Task<ActionResult<User>> PostUser([FromBody]User user)
		{
			if (user == null)
				return BadRequest();

			await _userService.Register(user);
			return Ok();
		}
	}
}

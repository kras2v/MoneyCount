using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.ObjectPool;
using Microsoft.IdentityModel.Protocols;
using MoneyCount.Data;
using MoneyCount.Data.Migrations;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Authentication;
using System.Security.Claims;

namespace MoneyCount.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ILogger<CategoryController> logger,
        MoneyCountDbContext context,
        IMapper mapper) : Controller
    {
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly UserManager<User> _userManager = userManager;
        private readonly MoneyCountDbContext _context = context;
        private readonly ILogger<CategoryController> _logger = logger;
        private readonly IMapper _mapper = mapper;


        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO user)
        {
            string message = "";
            IdentityResult result = new();
            try
            {
                User user_ = new()
                {
                    Name = user.Name,
                    UserName = user.Email,
                    Email = user.Email,
                };

                string password = user.PasswordHash;
                result = await _userManager.CreateAsync(user_, password);
                if (!result.Succeeded)
                {
                    return BadRequest(ResponseHelper.CreateResponse(
                        false,
                        string.Join(", ", result.Errors.Where(x => !x.Description.ToLower().Contains("username")).Select(x => x.Description)),
                        null
                    ));
                }
                message = "Registered Successfuly";
            }
            catch (Exception ex)
            {
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
            return Ok(ResponseHelper.CreateResponse(true, message, result));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel login)
        {
            string message = "";
            User? user_ = new();
            try
            {
                user_ = await _userManager.FindByEmailAsync(login.Email);

                if (user_ == null)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "No user exists.", null));
                }

                if (user_.EmailConfirmed == false)
                {
                    user_.EmailConfirmed = true;
                }

                var result = await _signInManager.PasswordSignInAsync(user_, login.Password, true, false);
                if (!result.Succeeded)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Check your login credentials.", result));
                }

                user_.LastLogin = DateTime.Now;
                var updateResult = await _userManager.UpdateAsync(user_);
                message = "Login Successful";
                return Ok(ResponseHelper.CreateResponse(true, message, user_));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong." + ex.Message, null));
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            string message = "See you soon!";
            try
            {
                var user = HttpContext.User;
                var principals = new ClaimsPrincipal(user);
                var result = _signInManager.IsSignedIn(principals);
                if (result)
                {
                    await _signInManager.SignOutAsync();
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong." + ex.Message, null));
            }
            return Ok(ResponseHelper.CreateResponse(true, message, null));
        }

        [HttpGet("admin"), Authorize]
        public async Task<IActionResult> AdminPage()
        {
            try
            {
                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser == null || !currentUser.IsAdmin)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }
                else
                {
                    var users = _userManager.Users.ToList();
                    var responseData = _mapper.Map<List<UserDTO>>(users);
                    return Ok(ResponseHelper.CreateResponse(true, "Welcome admin!", new { users = responseData }));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong." + ex.Message, null));
            }
        }

        [HttpGet("home/{email}"), Authorize]
        public async Task<IActionResult> HomePage(string email)
        {
            User? userInfo = await _userManager.FindByEmailAsync(email);
            if (userInfo == null)
            {
                return BadRequest(ResponseHelper.CreateResponse(false, "Access denied!", null));
            }
            var responseData = _mapper.Map<ViewUserModel>(userInfo);
            return Ok(ResponseHelper.CreateResponse(true, "Welcome user!", new { userInfo = responseData }));
        }

        [HttpGet("checkuser")]
        public async Task<IActionResult> CheckUser()
        {
            string message = "Logged in.";
            UpdateUserModel currentuser = new();
            try
            {
                var user = HttpContext.User;
                var principals = new ClaimsPrincipal(user);
                var result = _signInManager.IsSignedIn(principals);
                if (result)
                {
                    currentuser = _mapper.Map<UpdateUserModel>(await _signInManager.UserManager.GetUserAsync(principals));
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong!" + ex.Message, null));
            }
            return Ok(ResponseHelper.CreateResponse(true, message, new { user = currentuser }));
        }

        [HttpPut("update-user")]
        public async Task<IActionResult> UpdateUser(UpdateUserModel updatedUser)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var userToUpdate = await _userManager.GetUserAsync(User);
                    if (userToUpdate == null)
                    {
                        return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                    }

                    if (userToUpdate.Id != updatedUser.Id)
                    {
                        return Forbid();
                    }

                    _mapper.Map(updatedUser, userToUpdate);
                    userToUpdate.Name = updatedUser.Name;
                    userToUpdate.UserName = updatedUser.Email;
                    userToUpdate.Email = updatedUser.Email;

                    var updateResult = await _userManager.UpdateAsync(userToUpdate);
                    if (updateResult.Succeeded)
                    {
                        return Ok(ResponseHelper.CreateResponse(true, "Login Successful", userToUpdate));
                    }
                    return BadRequest(ResponseHelper.CreateResponse(false, string.Join(", ", updateResult.Errors.Select(x => x.Description)), null));
                }
                else
                {
                    return StatusCode(404, ResponseHelper.CreateResponse(false, string.Join(", ", ModelState.Root.Errors.Select(x => x.ErrorMessage)), null));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating a category.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordModel updatePassword)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage);
                    return BadRequest(ResponseHelper.CreateResponse(false, string.Join(", ", errors), null));
                }

                var userToUpdate = await _userManager.GetUserAsync(User);
                if (userToUpdate == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                var checkPasswordResult = await _userManager.CheckPasswordAsync(userToUpdate, updatePassword.OldPassword);
                if (!checkPasswordResult)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Wrong password entered", null));
                }

                var changePasswordResult = await _userManager.ChangePasswordAsync(userToUpdate, updatePassword.OldPassword, updatePassword.NewPassword);
                if (!changePasswordResult.Succeeded)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, string.Join(", ", changePasswordResult.Errors.Select(x => x.Description)), null));
                }

                var updateResult = await _userManager.UpdateAsync(userToUpdate);
                if (!updateResult.Succeeded)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, string.Join(", ", updateResult.Errors.Select(x => x.Description)), null));
                }

                return Ok(ResponseHelper.CreateResponse(true, "Password has been successfully updated!", userToUpdate));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the password.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                if (String.IsNullOrEmpty(id) || user.Id != id)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "User not found.", null));
                }

                var categoriesToRemove = _context.Categories.Where(c => c.UserId == id);
                _context.Categories.RemoveRange(categoriesToRemove);
                await _context.SaveChangesAsync();

                var userCategories = user.Categories;
                user.Categories.Clear();
                await _userManager.UpdateAsync(user);

                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok(ResponseHelper.CreateResponse(true, "Good bye!", null));
                }
                return BadRequest(ResponseHelper.CreateResponse(false, "An error occured while deleting user.", null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing a category.");
                return BadRequest(ResponseHelper.CreateResponse(false, "An error occured while deleting user.", null));
            }
        }
    }
}

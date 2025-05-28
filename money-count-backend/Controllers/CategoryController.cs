using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MoneyCount.Data;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Categories;
using MoneyCount.Models.Transactions;
using System.Collections.Generic;
using System.Net.Http.Headers;

namespace MoneyCount.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoryController(MoneyCountDbContext context,
        IMapper mapper,
        UserManager<User> userManager,
        ILogger<CategoryController> logger,
        IConfiguration configuration) : ControllerBase
    {
        private readonly MoneyCountDbContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<CategoryController> _logger = logger;
        private readonly IConfiguration _configuration = configuration;


        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                var categoriesList = await _context.Categories
                    .Include(t => t.User)
                    .Where(c => user.Email == c.User.Email && !c.IsDeleted)
                    .ToListAsync();

                var categoriesCount = await _context.Categories
                    .Include(t => t.User)
                    .Where(c => c.User.Email == user.Email && !c.IsDeleted)
                    .CountAsync();

                var responseData = _mapper.Map<List<CategoryModel>>(categoriesList);

                return Ok(ResponseHelper.CreateResponse(true, "Success", new { categories = responseData, categoriesCount }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all categories.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                if (id <= 0)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Invalid category record.", null));
                }

                var categoryById = await _context.Categories
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(c => c.Id == id && c.User.Email == user.Email && !c.IsDeleted);
                if (categoryById == null)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Category not found or is deleted.", null));
                }

                var responseData = _mapper.Map<CategoryModel>(categoryById);

                return Ok(ResponseHelper.CreateResponse(true, "Success", new { responseData }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching category by ID.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostCategory(CreateCategoryModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.GetUserAsync(User);
                    if (user == null)
                    {
                        return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                    }

                    var newCategory = await _context.Categories
                       .Include(t => t.User)
                       .FirstOrDefaultAsync(c => c.Name == model.Name && c.User.Email == user.Email && !c.IsDeleted);
                    if (newCategory != null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, $"Category with name {model.Name} already exists.", null));
                    }

                    newCategory = _mapper.Map<Category>(model);
                    newCategory.UserId = user.Id;

                    user.Categories.Add(newCategory);
                    _context.Categories.Add(newCategory);

                    await _userManager.UpdateAsync(user);
                    await _context.SaveChangesAsync();

                    var responseData = _mapper.Map<CategoryModel>(newCategory);
                    return Ok(ResponseHelper.CreateResponse(true, "Success", new { responseData }));
                }   
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while posting a new category.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory(CategoryModel updatedModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.GetUserAsync(User);
                    if (user == null)
                    {
                        return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                    }

                    if (updatedModel.Id <= 0)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Invalid category record.", null));
                    }
                    var categoryToUpdate = await _context.Categories
                        .Include(t => t.User)
                        .FirstOrDefaultAsync(c => c.Id == updatedModel.Id && c.User.Email == user.Email && !c.IsDeleted);
                    if (categoryToUpdate == null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Category not found.", null));
                    }

                    _mapper.Map(updatedModel, categoryToUpdate);
                    categoryToUpdate.UserId = user.Id;
                    await _context.SaveChangesAsync();

                    var responseData = _mapper.Map<CategoryModel>(categoryToUpdate);
                    return Ok(ResponseHelper.CreateResponse(true, "Success", new { responseData }));
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating a category.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }
                var count = _context.Categories.Where(c => !c.IsDeleted && c.UserId == user.Id).Count();
               if (count > 1)
                {
                    if (id <= 0)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Category not found.", null));
                    }

                    var categoryToDelete = await _context.Categories
                        .Include(t => t.User)
                        .FirstOrDefaultAsync(c => c.Id == id && c.User.Email == user.Email && !c.IsDeleted);

                    if (categoryToDelete == null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Category not found or deleted.", null));
                    }

                    categoryToDelete.IsDeleted = true;
                    await _context.SaveChangesAsync();

                    foreach (var transaction in _context.Transactions)
                    {
                        if (transaction.CategoryId == categoryToDelete.Id)
                        {
                            var cat = _context.Categories.Where(c => !c.IsDeleted).FirstOrDefault();
                            transaction.CategoryId = cat.Id;
                            transaction.Category = cat;
                        }
                    }

                    await _context.SaveChangesAsync();
                    return Ok(ResponseHelper.CreateResponse(true, "Deleted successfully", null));
                }
               else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "You cannot remove all categories :c", null));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing a category.");
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }
        [HttpPost]
        [Route("upload-category-icon")]
        public async Task<IActionResult> UploadCategoryIcon(IFormFile imageFile)
        {
            try
            {
                var filename = ContentDispositionHeaderValue
                    .Parse(imageFile.ContentDisposition)
                    .FileName?
                    .TrimStart('\"')
                    .TrimEnd('\"');
                if (filename == null)
                    return BadRequest(ResponseHelper.CreateResponse(false, "Only .svg type files are allowed", null));
             
                string directoryPath = Path.Combine(_configuration["FileStorage:DirectoryPath"]);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                string[] allowedImageExtensions =
                {
                    ".svg"
                };

                if (!allowedImageExtensions.Contains(Path.GetExtension(filename)))
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Only .svg type files are allowed", null));
                }

                string newFileName = Guid.NewGuid() + Path.GetExtension(filename);
                string fullFilePath = Path.Combine(directoryPath, newFileName);

                using (var stream = new FileStream(fullFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return Ok(new
                {
                    imageFile = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/StaticFiles/{newFileName}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while uploading a category icon.");
                return BadRequest(ResponseHelper.CreateResponse(false, "Only .svg type files are allowed", null));
            }
        }
    }
}

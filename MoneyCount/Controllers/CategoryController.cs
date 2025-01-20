using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoneyCount.Data;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Payment;
using System.Collections.Generic;
using System.Net.Http.Headers;

namespace MoneyCount.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly PaymentDbContext _context;
        private readonly IMapper _mapper;

        public CategoryController(PaymentDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        static private BaseResponseModel CreateResponse(bool status, string message, object? data)
        {
            BaseResponseModel response = new BaseResponseModel();

            response.Status = status;
            response.Message = message;
            if (data != null)
                response.Data = data;

            return response;
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categoriesCount = _context.Categories.Count();

                return Ok(CreateResponse(true, "Success", new { Categories = _context.Categories, Count = categoriesCount }));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("sorted-products/{id}")]
        public IActionResult GetAllCategories(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid category record.", null));
                }

                var categoryById = _context.Categories
                    .Where(x => x.Id == id)
                    .FirstOrDefault();
                if (categoryById == null)
                {
                    return BadRequest(CreateResponse(false, "Category not found.", null));
                }

                var responseData = _mapper.Map<List<PaymentListViewModel >>(_context.Payments
                    .Where(x => x.CategoryId == categoryById.Id))
                    .ToList();

                return Ok(CreateResponse(true, "Success", responseData));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid category record.", null));
                }

                var categoryById = _context.Categories
                    .Where(x => x.Id == id)
                    .FirstOrDefault();
                if (categoryById == null)
                {
                    return BadRequest(CreateResponse(false, "Category not found.", null));
                }

                var responseData = _mapper.Map<CategoryModel>(categoryById);

                return Ok(CreateResponse(true, "Success", responseData));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPost]
        public IActionResult PostCategory(CategoryModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var newCategory = _context.Categories
                   .Where(x => x.Name == model.Name)
                   .FirstOrDefault();
                    // if (newCategory != null)
                    // {
                    //     return BadRequest(CreateResponse(false, "Category has already exists.", null));
                    // }

                    newCategory = _mapper.Map<Category>(model);
                    _context.Categories.Add(newCategory);
                    _context.SaveChanges();

                    return Ok(CreateResponse(true, "Success", model));
                }
                else
                {
                    return BadRequest(CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, CategoryModel updatedModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (id <= 0)
                    {
                        return BadRequest(CreateResponse(false, "Invalid category record.", null));
                    }
                    var categoryToUpdate = _context.Categories
                        .Where(x => x.Id == id)
                        .FirstOrDefault();
                    if (categoryToUpdate == null)
                    {
                        return BadRequest(CreateResponse(false, "Category not found.", null));
                    }

                    _mapper.Map(updatedModel, categoryToUpdate);
                    _context.SaveChanges();

                    return Ok(CreateResponse(true, "Success", updatedModel));
                }
                else
                {
                    return BadRequest(CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpDelete]
        public IActionResult DeleteCategory(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Category not found.", null));
                }

                var categoryToDelete = _context.Categories
                    .Where (x => x.Id == id)
                    .FirstOrDefault();

                if (categoryToDelete == null)
                {
                    return BadRequest(CreateResponse(false, "Category not found.", null));
                }

                _context.Categories.Remove(categoryToDelete);
                _context.SaveChanges();

                return Ok(CreateResponse(true, "Deleted successfully", null));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
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
                    .FileName
                    .TrimStart('\"')
                    .TrimEnd('\"');
                string newPath = @"C:\to-delete";
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }

                string[] allowedImageExtensions =
                {
                    ".jpg",
                    ".jpeg",
                    ".png"
                };

                if (!allowedImageExtensions.Contains(Path.GetExtension(filename)))
                {
                    return BadRequest(CreateResponse(false, "Only .jpg, .jpeg and .png type files are allowed", null));
                }

                string newFileName = Guid.NewGuid() + Path.GetExtension(filename);
                string fullFilePath = Path.Combine(newPath, newFileName);

                using (var stream = new FileStream(fullFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return Ok(new
                {
                    ProfileImage = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/StaticFiles/{newFileName}" 
                });
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using MoneyCount.Data;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Categories;
using MoneyCount.Models.Transactions;
using System.Collections.Generic;
using System.Security.Claims;

namespace MoneyCount.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController(
        MoneyCountDbContext context,
        IMapper mapper,
        UserManager<User> userManager,
        ILogger<TransactionController> logger) : ControllerBase
    {
        private readonly MoneyCountDbContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<TransactionController> _logger = logger;

        [HttpGet]
        public async Task<IActionResult> GetAllRecordsByPages(int pageIndex = 0, int pageSize = 10)
        {
            try
            {
                string message = "";
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                var transactionCount = await _context.Transactions
                    .Where(t => t.UserId == user.Id)
                    .CountAsync();
               
                var transactionList = await _context.Transactions
                    .Include(t => t.Category)
                    .Include(t => t.User)
                    .Where(t => t.User.Id == user.Id && !t.IsDeleted)
                    .OrderByDescending(t => t.TransactionDate)
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var responseData = _mapper.Map<List<TransactionListViewModel>>(transactionList);

                if (transactionCount > 0)
                {
                    message = "Successesfully get all transaction records.";
                }
                else
                {
                    message = "Records not found.";
                }
                return Ok(ResponseHelper.CreateResponse(true, message, new { Transactions = responseData, Count = transactionCount }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all transactions.");
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("get-all-transactions")]
        public async Task<IActionResult> GetAllRecords()
        {
            try
            {
                string message = "";
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                var transactionCount = await _context.Transactions
                    .Where(t => t.UserId == user.Id)
                    .CountAsync();

                var transactionList = await _context.Transactions
                    .Include(t => t.Category)
                    .Include(t => t.User)
                    .Where(t => t.User.Id == user.Id && !t.IsDeleted)
                    .OrderByDescending(t => t.TransactionDate)
                    .ToListAsync();

                var responseData = _mapper.Map<List<TransactionListViewModel>>(transactionList);

                if (transactionCount > 0)
                {
                    message = "Successesfully get all transaction records.";
                }
                else
                {
                    message = "Records not found.";
                }
                return Ok(ResponseHelper.CreateResponse(true, message, new { Transactions = responseData, Count = transactionCount }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all transactions.");
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById(int id)
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
                    return BadRequest(ResponseHelper.CreateResponse(false, "Invalid transaction record.", null));
                }

                var transactionById = await _context.Transactions
                    .Include(t => t.User)
                    .Include(t => t.Category)
                    .FirstOrDefaultAsync(t => t.Id == id && t.User.Email == user.Email && !t.IsDeleted);

                if (transactionById == null)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Invalid transaction record.", null));
                }

                var responseData = _mapper.Map<TransactionDetailViewModel>(transactionById);
                return Ok(ResponseHelper.CreateResponse(true, "Success", new { Transaction = responseData }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching a transaction with ID: {id}");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostTransaction(CreateTransactionModel model)
        {

            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                if (ModelState.IsValid)
                {
                    var category = _mapper.Map<CategoryModel>(await _context.Categories
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == model.CategoryId && c.User.Email == user.Email && !c.IsDeleted));

                    if (category == null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Wrong category assigned.", null));
                    }

                    if (model.Amount > 9007199254740991)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Value is too big.", null));
                    }

                    var transactionDate = model.TransactionDate ?? DateTime.Now;
                    var newtransaction = _mapper.Map<Transaction>(model);
                    newtransaction.UserId = user.Id;
                    newtransaction.TransactionDate = transactionDate;

                    user.Transactions.Add(newtransaction);
                    _context.Transactions.Add(newtransaction);

                    await _context.SaveChangesAsync();
                    await _userManager.UpdateAsync(user);

                    var responseData = _mapper.Map<TransactionDetailViewModel>(newtransaction);

                    return Ok(ResponseHelper.CreateResponse(true, "Record has been created succesfully.", new { Transaction = responseData }));
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a transaction.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPost("post-transactions")]
        public async Task<IActionResult> PostTransactions(List<CreateTransactionModel> models)
        {

            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                if (ModelState.IsValid)
                {
                    foreach (var model in models)
                    {
                        var category = _mapper.Map<CategoryModel>(await _context.Categories
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == model.CategoryId && c.User.Email == user.Email && !c.IsDeleted));

                        if (category == null)
                        {
                            return BadRequest(ResponseHelper.CreateResponse(false, "Wrong category assigned.", null));
                        }

                        if (model.Amount > 9007199254740991)
                        {
                            return BadRequest(ResponseHelper.CreateResponse(false, "Value is too big.", null));
                        }
                        var transactionDate = model.TransactionDate ?? DateTime.Now;
                        var newtransaction = _mapper.Map<Transaction>(model);
                        newtransaction.UserId = user.Id;
                        newtransaction.TransactionDate = transactionDate;

                        _context.Transactions.Add(newtransaction);
                        await _context.SaveChangesAsync();

                        var responseData = _mapper.Map<TransactionDetailViewModel>(newtransaction);
                    }

                    return Ok(ResponseHelper.CreateResponse(true, "Record has been created succesfully.", null));
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a transaction.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateTransaction(PutTransactionModel updatedModel)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(ResponseHelper.CreateResponse(false, "Access denied!", null));
                }

                if (updatedModel.Id <= 0)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Invalid transaction record", null));
                }

                if (ModelState.IsValid)
                {
                    var transactionToUpdate = await _context.Transactions
                        .Include(t => t.Category)
                        .FirstOrDefaultAsync(t => t.Id == updatedModel.Id && t.User.Email == user.Email && !t.IsDeleted);
                    if (transactionToUpdate == null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Invalid transaction record.", null));
                    }

                    var category = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Id == updatedModel.CategoryId && c.User.Email == user.Email && !c.IsDeleted);
                    if (category == null)
                    {
                        return BadRequest(ResponseHelper.CreateResponse(false, "Wrong category assigned.", null));
                    }
                    
                    var transactionDate = updatedModel.TransactionDate ?? DateTime.Now;
                    _mapper.Map(updatedModel, transactionToUpdate);
                    transactionToUpdate.TransactionDate = transactionDate;

                    await _context.SaveChangesAsync();

                    var responseData = _mapper.Map<TransactionDetailViewModel>(transactionToUpdate);

                    return Ok(ResponseHelper.CreateResponse(true, "Record has been updated succesfully", new { Transaction = responseData }));
                }
                else
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating a transaction with ID: {updatedModel.Id}.");
                return StatusCode(500, ResponseHelper.CreateResponse(false, "Something went wrong..", null));
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTransaction(int id)
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
                    return BadRequest(ResponseHelper.CreateResponse(false, "Transaction not found.", null));
                }

                var transactionToDelete = await _context.Transactions
                    .FirstOrDefaultAsync(t => t.Id == id && t.User.Email == user.Email&& !t.IsDeleted);

                if (transactionToDelete == null)
                {
                    return BadRequest(ResponseHelper.CreateResponse(false, "Transaction not found or already deleted.", null));
                }

                transactionToDelete.IsDeleted = true;
                await _context.SaveChangesAsync();

                return Ok(ResponseHelper.CreateResponse(true, "Transaction deleted successfully", null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while deleting a transaction with ID: {id}.");
                return BadRequest(ResponseHelper.CreateResponse(false, "Something went wrong.", null));
            }
        }
    }
}
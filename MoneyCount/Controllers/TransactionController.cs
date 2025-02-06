using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using MoneyCount.Data;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Payment;

namespace MoneyCount.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly MoneyCountDbContext _context;
        private readonly IMapper _mapper;

        public TransactionController(MoneyCountDbContext context, IMapper mapper)
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
        public IActionResult GetAllRecords(int pageIndex = 0, int pageSize = 10)
        {
            try
            {
                var transactionCount = _context.Transactions.Count();
                var transactionList = _mapper.Map<List<TransactionListViewModel>>(
                    _context.Transactions
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.TransactionDate)
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize))
                    .ToList();

                if (transactionCount > 0)
                {
                    return Ok(CreateResponse(true, "Success.", new { Transactions = transactionList, Count = transactionCount }));
                }
                else
                {
                    return Ok(CreateResponse(true, "No records yet.", new { Transactions = transactionList, Count = transactionCount }));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetTransactionById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid transaction record.", null));
                }

                var transactionById = _context.Transactions
                    .Where(x => x.Id == id)
                    .Include(x => x.Category)
                    .FirstOrDefault();

                if (transactionById == null)
                {
                    return BadRequest(CreateResponse(false, "Invalid transaction record.", null));
                }

                var responseData = _mapper.Map<TransactionDetailViewMode>(transactionById);
                if (responseData == null)
                {
                    return BadRequest(CreateResponse(false, "No record exists.", null));
                }
                return Ok(CreateResponse(true, "Success", responseData));
            }
            catch (Exception ex)
            {
                //TODO: do logging exception
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPost]
        public IActionResult PostTransaction(CreateTransactionModel model)
        {

            try
            {
                if (ModelState.IsValid)
                {
                    var category = _context.Categories
                        .Where(x => x.Id == model.CategoryId)
                        .FirstOrDefault();
                    if (category == null)
                    {
                        return BadRequest(CreateResponse(false, "Wrong category assigned.", null));
                    }

                    if (model.Amount > 9007199254740991)
                    { 
                        Exception exception = new Exception("Value is too big");
                        throw exception;
                    }

                    var transactionDate = model.TransactionDate.HasValue ? model.TransactionDate.Value : DateTime.Now;
                    var newtransaction = _mapper.Map<Transaction>(model);
                    newtransaction.Category = category;

                    _context.Transactions.Add(newtransaction);
                    _context.SaveChanges();

                    var responseData = _mapper.Map<TransactionDetailViewMode>(newtransaction);

                    return Ok(CreateResponse(true, "Record has been created succesfully.", responseData));
                }
                else
                {
                    return BadRequest(CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpPut]
        public IActionResult UpdateTransaction(PutTransactionModel updatedModel)
        {

            try
            {
                if (updatedModel.Id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid transaction record", null));
                }
                if (ModelState.IsValid)
                {
                    var transactionToUpdate = _context.Transactions
                        .Where(x => x.Id == updatedModel.Id)
                        .Include(x => x.Category)
                        .FirstOrDefault();
                    if (transactionToUpdate == null)
                    {
                        return BadRequest(CreateResponse(false, "Invalid transaction record", null));
                    }

                    var category = _context.Categories
                        .Where(x => x.Id == updatedModel.CategoryId)
                        .FirstOrDefault();
                    if (category == null)
                    {
                        return BadRequest(CreateResponse(false, "Wrong category assigned.", null));
                    }
                    
                    var transactionDate = updatedModel.TransactionDate.HasValue ? updatedModel.TransactionDate.Value : DateTime.Now;

                    _mapper.Map(updatedModel, transactionToUpdate);
                    
                    _context.SaveChanges();

                    var responseData = _mapper.Map<TransactionDetailViewMode>(transactionToUpdate);

                    return Ok(CreateResponse(true, "Record has been updated succesfully", responseData));
                }
                else
                {
                    return BadRequest(CreateResponse(false, "Validation failed.", ModelState));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(CreateResponse(false, "Something went wrong..", null));
            }
        }

        [HttpDelete]
        public IActionResult DeleteTransaction(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "transaction not found.", null));
                }

                var transactionToDelete = _context.Transactions
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                if (transactionToDelete == null)
                {
                    return BadRequest(CreateResponse(false, "transaction not found.", null));
                }

                _context.Transactions.Remove(transactionToDelete);
                _context.SaveChanges();

                return Ok(CreateResponse(true, "Deleted successfully", null));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet]
        [Route("Search/{searchText}")]
        public IActionResult GetTransaction(string searchText)
        {
            try
            {
                var searchedtransaction = _context.Transactions
                    .Where(x => x.Name.Contains(searchText))
                    .Select(x => new { x.Id, x.Name }).ToList();

                return Ok(CreateResponse(true, "Success", searchedtransaction));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }
    }
}
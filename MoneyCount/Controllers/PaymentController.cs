using AutoMapper;
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
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentDbContext _context;
        private readonly IMapper _mapper;

        public PaymentController(PaymentDbContext context, IMapper mapper)
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
                var paymentCount = _context.Payments.Count();
                var paymentList = _mapper.Map<List<PaymentListViewModel>>(
                    _context.Payments
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.PaymentDate)
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize))
                    .ToList();

                if (paymentCount > 0)
                {
                    return Ok(CreateResponse(true, "Success.", new { Payments = paymentList, Count = paymentCount }));
                }
                else
                {
                    return BadRequest(CreateResponse(true, "No records yet.", new { Payments = paymentList, Count = paymentCount }));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetPaymentById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid payment record.", null));
                }

                var paymentById = _context.Payments
                    .Where(x => x.Id == id)
                    .Include(x => x.Category)
                    .FirstOrDefault();

                if (paymentById == null)
                {
                    return BadRequest(CreateResponse(false, "Invalid payment record.", null));
                }

                var responseData = _mapper.Map<PaymentDetailViewMode>(paymentById);
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
        public IActionResult PostPayment(CreatePaymentModel model)
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

                    var paymentDate = model.PaymentDate.HasValue ? model.PaymentDate.Value : DateTime.Now;
                    var newPayment = _mapper.Map<Payment>(model);
                    newPayment.Category = category;

                    _context.Payments.Add(newPayment);
                    _context.SaveChanges();

                    var responseData = _mapper.Map<PaymentDetailViewMode>(newPayment);

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
        public IActionResult UpdatePayment(PutPaymentModel updatedModel)
        {

            try
            {
                if (updatedModel.Id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Invalid payment record", null));
                }
                if (ModelState.IsValid)
                {
                    var paymentToUpdate = _context.Payments
                        .Where(x => x.Id == updatedModel.Id)
                        .Include(x => x.Category)
                        .FirstOrDefault();
                    if (paymentToUpdate == null)
                    {
                        return BadRequest(CreateResponse(false, "Invalid payment record", null));
                    }

                    var category = _context.Categories
                        .Where(x => x.Id == updatedModel.CategoryId)
                        .FirstOrDefault();
                    if (category == null)
                    {
                        return BadRequest(CreateResponse(false, "Wrong category assigned.", null));
                    }
                    
                    var paymentDate = updatedModel.PaymentDate.HasValue ? updatedModel.PaymentDate.Value : DateTime.Now;

                    _mapper.Map(updatedModel, paymentToUpdate);
                    
                    _context.SaveChanges();

                    var responseData = _mapper.Map<PaymentDetailViewMode>(paymentToUpdate);

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
        public IActionResult DeletePayment(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(CreateResponse(false, "Payment not found.", null));
                }

                var paymentToDelete = _context.Payments
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                if (paymentToDelete == null)
                {
                    return BadRequest(CreateResponse(false, "Payment not found.", null));
                }

                _context.Payments.Remove(paymentToDelete);
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
        public IActionResult GetPayment(string searchText)
        {
            try
            {
                var searchedPayment = _context.Payments
                    .Where(x => x.Name.Contains(searchText))
                    .Select(x => new { x.Id, x.Name }).ToList();

                return Ok(CreateResponse(true, "Success", searchedPayment));
            }
            catch (Exception)
            {
                return BadRequest(CreateResponse(false, "Something went wrong.", null));
            }
        }
    }
}
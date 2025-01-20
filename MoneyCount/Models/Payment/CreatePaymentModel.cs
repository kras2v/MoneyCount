using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoneyCount.Entities;
using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models
{
    public class CreatePaymentModel
    {
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        public string? Description { get; set; }
        [Required(ErrorMessage = "Amount of payment is required")]
        public decimal Amount { get; set; }
        [Required(ErrorMessage = "Category is required")]
        public int CategoryId { get; set; }
        public DateTime? PaymentDate { get; set; } = DateTime.Now;
    }
}

using MoneyCount.Entities;
using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models.Payment
{
    public class PaymentListViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public Category Category { get; set; }
        public DateTime? PaymentDate { get; set; } = DateTime.Now;
    }
}

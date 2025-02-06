using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int CategoryId { get; set; } 
        public required Category Category { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public DateTime CreatedDate {  get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyCount.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int CategoryId { get; set; } 
        [Column(TypeName = "datetime")]
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime")]
        public DateTime CreatedDate {  get; set; } = DateTime.Now;
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
        public required Category Category { get; set; }
        public string UserId { get; set; }
        public User User { get; set; } = null!;
    }
}

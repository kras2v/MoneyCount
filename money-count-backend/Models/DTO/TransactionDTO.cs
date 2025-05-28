using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyCount.Entities
{
    public class TransactionDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; }
        public required UserDTO User { get; set; }
        public required CategoryDTO Category { get; set; }
    }
}

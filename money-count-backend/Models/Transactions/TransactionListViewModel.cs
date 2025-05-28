using MoneyCount.Entities;

namespace MoneyCount.Models.Transactions
{
    public class TransactionListViewModel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Amount { get; set; }
        public required CategoryDTO Category { get; set; }
        public DateTime? TransactionDate { get; set; } = DateTime.Now;
    }
}

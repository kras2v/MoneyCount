using MoneyCount.Entities;
using MoneyCount.Models.Transactions;
using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models
{
    public class TransactionDetailViewModel : TransactionListViewModel
    {
        public string? Description { get; set; }
    }
}

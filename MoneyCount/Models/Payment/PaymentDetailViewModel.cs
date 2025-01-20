using MoneyCount.Entities;
using MoneyCount.Models.Payment;
using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models
{
    public class PaymentDetailViewMode : PaymentListViewModel
    {
        public string Description { get; set; }
    }
}

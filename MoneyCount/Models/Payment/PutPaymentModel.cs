using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MoneyCount.Models
{
    public class PutPaymentModel : CreatePaymentModel
    {
        public int Id { get; set; }
    }
}

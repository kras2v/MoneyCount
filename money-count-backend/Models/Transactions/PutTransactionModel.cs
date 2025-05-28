using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MoneyCount.Models
{
    public class PutTransactionModel : CreateTransactionModel
    {
        public int Id { get; set; }
    }
}

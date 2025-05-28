using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MoneyCount.Models
{
    public class BaseResponseModel(bool status, string message, object? data)
    {
        public bool Status { get; set; } = status;
        public string Message { get; set; } = message;
        public object? Data { get; set; } = data;
    }
}

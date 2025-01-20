using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MoneyCount.Entities
{
    public class Category
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string? Icon { get; set; }
        
    }
}

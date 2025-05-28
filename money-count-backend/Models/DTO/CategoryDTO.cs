using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MoneyCount.Entities
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Icon { get; set; }
        public bool IsDeleted { get; set; }
        public UserDTO User { get; set; } = null!;
    }
}

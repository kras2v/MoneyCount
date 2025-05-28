using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MoneyCount.Entities
{
    public class UserDTO
    {
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string PasswordHash { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsAdmin { get; set; } = false;
    }
}

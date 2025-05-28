using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MoneyCount.Entities
{
    public class User : IdentityUser
    {
        public string Name { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime")]
        public DateTime LastLogin { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedDate { get; set; } = DateTime.Now;
        public bool IsAdmin { get; set; } = false;
        public ICollection<Transaction> Transactions { get; set; } = [];
        public ICollection<Category> Categories { get; set; } = [];
    }
}

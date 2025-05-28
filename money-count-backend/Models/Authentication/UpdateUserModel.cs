using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyCount.Models.Authentication
{
    public class UpdateUserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}

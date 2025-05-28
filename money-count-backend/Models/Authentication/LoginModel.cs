using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models.Authentication
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public required string Email { get; set; }

        [Required]
        [UIHint("Password")]
        [Display(Name = "Password")]
        public required string Password { get; set; }

        [Required]
        [Display(Name = "Remember")]
        public bool Remember { get; set; }
    }
}

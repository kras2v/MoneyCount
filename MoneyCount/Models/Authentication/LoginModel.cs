using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models.Authentication
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string EmailAddress { get; set; }

        [Required]
        [UIHint("Password")]
        [Display(Name = "Password")]
        public string Password { get; set; }
    }
}

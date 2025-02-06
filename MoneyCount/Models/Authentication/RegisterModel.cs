using System.ComponentModel.DataAnnotations;

namespace MoneyCount.Models.Authentication
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Name is required field")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string EmailAddress { get; set; }

        [Required]
        [UIHint("Password")]
        [Compare("ConfirmPassword")]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [UIHint("Password")]
        [Compare("ConfirmPassword")]
        [Display(Name = "ConfirmPassword")]
        public string ConfirmPassword { get; set; }
    }
}

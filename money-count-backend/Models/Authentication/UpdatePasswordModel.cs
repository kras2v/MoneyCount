namespace MoneyCount.Models.Authentication
{
    public class UpdatePasswordModel
    {
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}

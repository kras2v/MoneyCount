namespace MoneyCount.Models.Authentication
{
    public class ViewUserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsAdmin { get; set; } = false;
    }
}

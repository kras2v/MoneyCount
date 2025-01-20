using Microsoft.EntityFrameworkCore;
using MoneyCount.Entities;

namespace MoneyCount.Data
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options)
        {
            
        }

        public DbSet<Payment> Payments { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>()
              .HasOne(p => p.Category) 
              .WithMany()
              .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Food"},
                new Category { Id = 2, Name = "Transport"},
                new Category { Id = 3, Name = "Entertainment"}
            );
            base.OnModelCreating(modelBuilder);
        }
    }
}

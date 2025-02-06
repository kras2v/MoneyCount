using Microsoft.EntityFrameworkCore;
using MoneyCount.Entities;

namespace MoneyCount.Data
{
    public class MoneyCountDbContext : DbContext
    {
        public MoneyCountDbContext(DbContextOptions<MoneyCountDbContext> options) : base(options)
        {
            
        }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
              .HasOne(p => p.Category) 
              .WithMany()
              .HasForeignKey(p => p.CategoryId);

            base.OnModelCreating(modelBuilder);
        }
    }
}

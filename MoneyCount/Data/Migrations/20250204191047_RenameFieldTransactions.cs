using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyCount.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameFieldTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "Transactions",
                newName: "TransactionDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionDate",
                table: "Transactions",
                newName: "PaymentDate");
        }
    }
}

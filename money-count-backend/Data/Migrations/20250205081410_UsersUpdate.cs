using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyCount.Data.Migrations
{
    /// <inheritdoc />
    public partial class UsersUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "EmailAddress");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmailAddress",
                table: "Users",
                newName: "Email");
        }
    }
}

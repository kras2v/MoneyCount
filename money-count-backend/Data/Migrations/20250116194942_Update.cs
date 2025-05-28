using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyCount.Data.Migrations
{
    /// <inheritdoc />
    public partial class Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Categories_CategoryId1",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_CategoryId1",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CategoryId1",
                table: "Payments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId1",
                table: "Payments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CategoryId1",
                table: "Payments",
                column: "CategoryId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Categories_CategoryId1",
                table: "Payments",
                column: "CategoryId1",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}

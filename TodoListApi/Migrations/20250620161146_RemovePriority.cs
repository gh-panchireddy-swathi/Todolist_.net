using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoListApi.Migrations
{
    /// <inheritdoc />
    public partial class RemovePriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "TodoTasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "TodoTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

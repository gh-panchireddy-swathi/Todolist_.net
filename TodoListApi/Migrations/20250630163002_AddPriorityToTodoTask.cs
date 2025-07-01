using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoListApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPriorityToTodoTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "TodoTasks",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "TodoTasks");
        }
    }
}

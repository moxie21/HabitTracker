using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HabitTrackerAPI.Migrations
{
    public partial class Tasks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TasksHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "DateTime", nullable: false),
                    TaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TasksHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TasksHistory_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TasksMeta",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "DateTime", nullable: false),
                    RepeatInterval = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RepeatYear = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RepeatMonth = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RepeatDay = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RepeatWeek = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RepeatWeekday = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    TaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TasksMeta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TasksMeta_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_UserId",
                table: "Tasks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TasksHistory_TaskId",
                table: "TasksHistory",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_TasksMeta_TaskId",
                table: "TasksMeta",
                column: "TaskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TasksHistory");

            migrationBuilder.DropTable(
                name: "TasksMeta");

            migrationBuilder.DropTable(
                name: "Tasks");
        }
    }
}

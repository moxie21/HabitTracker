﻿// <auto-generated />
using System;
using HabitTrakerAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HabitTrackerAPI.Migrations
{
    [DbContext(typeof(HabitTrackerDBContext))]
    [Migration("20200506154112_Highlights")]
    partial class Highlights
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HabitTrackerAPI.Entities.HabitsHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Date")
                        .HasColumnType("DateTime");

                    b.Property<int>("HabitId")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("HabitId");

                    b.ToTable("HabitsHistory");
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.Highlight", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Color")
                        .HasColumnType("nvarchar(10)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Highlights");
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.HighlightsHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Date")
                        .HasColumnType("DateTime");

                    b.Property<int>("HighlightId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("HighlightId");

                    b.ToTable("HighlightsHistory");
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Country")
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("DateTime");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Role")
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("HabitTrackerAPI.Models.Habit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Color")
                        .HasColumnType("nvarchar(10)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Habits");
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.HabitsHistory", b =>
                {
                    b.HasOne("HabitTrackerAPI.Models.Habit", "Habit")
                        .WithMany("HabitsHistory")
                        .HasForeignKey("HabitId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.Highlight", b =>
                {
                    b.HasOne("HabitTrackerAPI.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HabitTrackerAPI.Entities.HighlightsHistory", b =>
                {
                    b.HasOne("HabitTrackerAPI.Entities.Highlight", "Highlight")
                        .WithMany("HighlightsHistories")
                        .HasForeignKey("HighlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HabitTrackerAPI.Models.Habit", b =>
                {
                    b.HasOne("HabitTrackerAPI.Entities.User", "User")
                        .WithMany("Habits")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
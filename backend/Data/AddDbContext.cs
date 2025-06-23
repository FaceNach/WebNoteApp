using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AddDbContext : DbContext
    {
       public AddDbContext(DbContextOptions<AddDbContext> options) : base(options)
        {
        }

       public DbSet<NoteApp> NoteApps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NoteApp>()
                            .HasKey(n => n.Id);

            base.OnModelCreating(modelBuilder);
        }

    }
}


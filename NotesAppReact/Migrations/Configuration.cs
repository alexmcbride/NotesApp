namespace NotesAppReact.Migrations
{
    using NotesAppReact.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<NotesAppReact.Models.NotesContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "NotesAppReact.Models.NotesContext";
        }

        protected override void Seed(NotesAppReact.Models.NotesContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Notes.AddOrUpdate(n => n.Id,
                new Note { Title = "Note 1", Content = "Content for note 1", Created = DateTime.Now },
                new Note { Title = "Note 2", Content = "Content for note 2", Created = DateTime.Now },
                new Note { Title = "Note 3", Content = "Content for note 3", Created = DateTime.Now },
                new Note { Title = "Note 4", Content = "Content for note 4", Created = DateTime.Now },
                new Note { Title = "Note 5", Content = "Content for note 5", Created = DateTime.Now }

            );
        }
    }
}

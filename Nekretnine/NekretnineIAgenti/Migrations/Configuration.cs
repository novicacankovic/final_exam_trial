namespace NekretnineIAgenti.Migrations
{
    using NekretnineIAgenti.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<NekretnineIAgenti.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(NekretnineIAgenti.Models.ApplicationDbContext context)
        {
            context.Agent.AddOrUpdate(x => x.Id,
               new Agent() { Id = 1, ImeIPrezime = "Pera Peric", Licenca = "Lic1", GodinaRodjenja = 1960, BrojProdatihNekretnina = 15 },
               new Agent() { Id = 2, ImeIPrezime = "Mika Mikic", Licenca = "Lic2", GodinaRodjenja = 1970, BrojProdatihNekretnina = 10 },
               new Agent() { Id = 3, ImeIPrezime = "Sanja Sanjic", Licenca = "Lic3", GodinaRodjenja = 1980, BrojProdatihNekretnina = 5 }
           );

            context.Nekretnina.AddOrUpdate(x => x.Id,
                new Nekretnina() { Id = 1, Mesto = "Novi Sad", AgencijskaOznaka = "Nek01", GodinaIzgradnje = 1974, Kvadratura = 50m, Cena = 40000, AgentId = 1 },
                new Nekretnina() { Id = 2, Mesto = "Beograd", AgencijskaOznaka = "Nek02", GodinaIzgradnje = 1990, Kvadratura = 60m, Cena = 50000, AgentId = 2 },
                new Nekretnina() { Id = 3, Mesto = "Subotica", AgencijskaOznaka = "Nek03", GodinaIzgradnje = 1995, Kvadratura = 55m, Cena = 45000, AgentId = 3 },
                new Nekretnina() { Id = 4, Mesto = "Zrenjanin", AgencijskaOznaka = "Nek04", GodinaIzgradnje = 2010, Kvadratura = 70m, Cena = 60000, AgentId = 1 }
            );
        }
    }
}

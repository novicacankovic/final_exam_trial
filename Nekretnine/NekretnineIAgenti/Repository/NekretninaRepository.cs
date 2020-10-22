using NekretnineIAgenti.Interfaces;
using NekretnineIAgenti.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace NekretnineIAgenti.Repository
{
    public class NekretninaRepository : IDisposable, INekretninaRepository
    {

        private ApplicationDbContext db = new ApplicationDbContext();


        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (db != null)
                {
                    db.Dispose();
                    db = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


        public void Add(Nekretnina nekretnina)
        {
            db.Nekretnina.Add(nekretnina);
            db.SaveChanges();
        }

        public void Delete(Nekretnina nekretnina)
        {
            db.Nekretnina.Remove(nekretnina);
            db.SaveChanges();
        }

       

        public IEnumerable<Nekretnina> GetAll()
        {
            return db.Nekretnina.Include(a => a.Agent);

        }

        public Nekretnina GetById(int id)
        {
            return db.Nekretnina.Include(a => a.Agent).FirstOrDefault(a => a.Id == id);
        }

        public void Update(Nekretnina nekretnina)
        {
            db.Entry(nekretnina).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
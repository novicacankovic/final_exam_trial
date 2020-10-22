using NekretnineIAgenti.Interfaces;
using NekretnineIAgenti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NekretnineIAgenti.Repository
{
    public class AgentRepository : IDisposable, IAgentRepository
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

    
        public IEnumerable<Agent> GetAll()
        {
            return db.Agent;           
        }

        public Agent GetById(int id)
        {
            return db.Agent.FirstOrDefault(a => a.Id == id);
        }
    }
}
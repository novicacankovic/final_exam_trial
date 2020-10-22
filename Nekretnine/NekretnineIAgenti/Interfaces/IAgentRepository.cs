using NekretnineIAgenti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NekretnineIAgenti.Interfaces
{
   public interface IAgentRepository
    {
        IEnumerable<Agent> GetAll();
        Agent GetById(int id);
    }
}

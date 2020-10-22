using NekretnineIAgenti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NekretnineIAgenti.Interfaces
{
   public interface INekretninaRepository
    {
        IEnumerable<Nekretnina> GetAll();
        Nekretnina GetById(int id);
        void Add(Nekretnina nekretnina);
        void Update(Nekretnina nekretnina);
        void Delete(Nekretnina nekretnina);
    }
}

using NekretnineIAgenti.Interfaces;
using NekretnineIAgenti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NekretnineIAgenti.Controllers
{
    public class AgentiController : ApiController
    {
        IAgentRepository _repository { get; set; }

        public AgentiController(IAgentRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Agent> Get()
        {
            return _repository.GetAll();
        }

        public IHttpActionResult Get (int id)
        {
            var agent = _repository.GetById(id);
            if (agent == null)
            {
                return NotFound();
            }
            else
                return Ok(agent);
        }

        [HttpGet]
        [Route("api/ekstremi")]
        public IEnumerable<Agent> GetExtremi()
        {
            var ekstremi = new List<Agent>();
            ekstremi.Add(_repository.GetAll().OrderByDescending(a=>a.BrojProdatihNekretnina).FirstOrDefault());
            ekstremi.Add(_repository.GetAll().OrderByDescending(a => a.BrojProdatihNekretnina).LastOrDefault());
            return ekstremi;

        }

        [HttpGet]
        [Route("api/najmladji")]
        public IEnumerable<Agent> GetNajmladji()
        {
            return _repository.GetAll().OrderByDescending(a => a.GodinaRodjenja);
        }


    }
}

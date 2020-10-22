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
    public class NekretnineController : ApiController
    {
        INekretninaRepository _repository { get; set; }

        public NekretnineController(INekretninaRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Nekretnina> Get()
        {
            return _repository.GetAll();
        }

        public IHttpActionResult Get(int id)
        {
            var nekretnina = _repository.GetById(id);
            if (nekretnina == null)
            {
                return NotFound();
            }
            else
                return Ok(nekretnina);
        }

        [HttpGet]
        public IEnumerable<Nekretnina> Search(int napravljeno)
        {
            return _repository.GetAll().Where(a => a.GodinaIzgradnje > napravljeno).OrderBy(a => a.GodinaIzgradnje);
        }

        public IHttpActionResult Post(Nekretnina nekretnina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repository.Add(nekretnina);
            nekretnina = _repository.GetById(nekretnina.Id); //ovo su dodela za id
            return CreatedAtRoute("DefaultApi", new { id = nekretnina.Id }, nekretnina);
        }
        [Authorize]
        public IHttpActionResult Put(int id, Nekretnina nekretnina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nekretnina.Id)
            {
                return BadRequest();
            }

            try
            {
                _repository.Update(nekretnina);

            }
            catch
            {
                throw;
            }

            return Ok(nekretnina);
        }

        public IHttpActionResult Delete(int id)
        {
            var nekretnina = _repository.GetById(id);
            if (nekretnina == null)
            {
                return NotFound();
            }
            else
                _repository.Delete(nekretnina);
            return Ok();
        }

        [HttpPost]
        [Route("api/pretraga")]
        public IEnumerable<Nekretnina> SearchPost([FromBody] NekretninePretraga nekretninePretraga) //kada saljem model a ne tipove
        {
            return _repository.GetAll().Where(x => x.Kvadratura > nekretninePretraga.Mini && x.Kvadratura < nekretninePretraga.Maksi).OrderBy(x => x.Kvadratura);
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NekretnineIAgenti.Models
{
    public class Nekretnina
    {
        public int Id { get; set; }

        [Required]
        [StringLength(maximumLength:40)]
        public string Mesto { get; set; }

        [Required]
        [StringLength(5)]
        public string AgencijskaOznaka { get; set; }

        [Range(1900,2018)]
        public int GodinaIzgradnje { get; set; }

        [Required]
        [Range(2.01, 99999.99)]
        public decimal Kvadratura { get; set; }

        [Required]
        [Range(0.01, 100000.00)]
        public decimal Cena { get; set; }

        public int AgentId { get; set; }

        public virtual Agent Agent { get; set; }
    }
}






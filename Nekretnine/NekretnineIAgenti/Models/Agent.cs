using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NekretnineIAgenti.Models
{
    public class Agent
    {
        public int Id { get; set; }

        [Required]
        [StringLength(maximumLength: 50)]
        public string ImeIPrezime { get; set; }

        [Required]
        [StringLength(4, MinimumLength =4,ErrorMessage ="Unesti 4")]
        public string Licenca { get; set; }

        [Range(1951,1995)]
        public int GodinaRodjenja { get; set; }

        [Required]
        [Range(0,50)]
        public int BrojProdatihNekretnina { get; set; }

    }
}

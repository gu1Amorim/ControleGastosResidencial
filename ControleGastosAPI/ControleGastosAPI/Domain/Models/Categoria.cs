using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastosAPI.Domain.Models
{
    [Table("categorias")]
    public class Categoria
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();
        public string descricao { get; set; } = default!;
        public int finalidade { get; set; }
    }
}

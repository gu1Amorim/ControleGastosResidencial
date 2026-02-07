using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastosAPI.Domain.Models
{
    [Table("transacoes")]
    public class Transacao
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();
        public string? descricao { get; set; }
        public decimal valor { get; set; }
        public int tipo { get; set; }
        public Guid pessoaid { get; set; }
        public Guid categoriaid { get; set; }
    }
}

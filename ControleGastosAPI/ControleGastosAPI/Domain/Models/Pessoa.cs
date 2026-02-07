using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastosAPI.Domain.Models
{
    [Table("pessoas")]
    public class Pessoa
    {
        [Key]
        public Guid id { get; set; }

        [Required]
        [MaxLength(200)]
        public string nome { get; set; } = default!;

        public int idade { get; set; }

        public virtual ICollection<Transacao> transacoes { get; set; } = new List<Transacao>();

        public Pessoa() { }

        public Pessoa(string nome, int idade)
        {
            this.id = Guid.NewGuid();
            this.nome = nome ?? throw new ArgumentException(nameof(nome));
            this.idade = idade;
        }
    }
}

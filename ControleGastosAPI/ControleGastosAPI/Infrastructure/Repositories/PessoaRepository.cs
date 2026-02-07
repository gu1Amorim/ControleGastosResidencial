using ControleGastosAPI.Domain.Interfaces;
using ControleGastosAPI.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosAPI.Infrastructure.Repositories
{
    public class PessoaRepository : IPessoaRepository
    {

        private readonly ConnectionContext _context;

        public PessoaRepository(ConnectionContext context) => _context = context;

        public List<Pessoa> GetAll() => _context.Pessoas.ToList();

        public Pessoa? GetById(Guid id) => _context.Pessoas.Find(id);

        public void Add(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            _context.SaveChanges();
        }

        public void Update(Pessoa pessoa)
        {
            // Verificamos se já existe uma instância com esse ID sendo rastreada localmente
            var local = _context.Pessoas.Local.FirstOrDefault(entry => entry.id == pessoa.id);

            if (local != null)
            {
                // Se existir, mandamos o EF "largar" (Detach) a instância antiga
                _context.Entry(local).State = EntityState.Detached;
            }

            // Agora o EF aceita rastrear o novo objeto que veio do seu formulário
            _context.Entry(pessoa).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Delete(Guid id)
        {
            var pessoa = _context.Pessoas.Find(id);
            if (pessoa != null)
            {
                _context.Pessoas.Remove(pessoa);
                _context.SaveChanges();
            }
        }

    }
}

using ControleGastosAPI.Domain.Models;
using ControleGastosAPI.Domain.Interfaces;
using Microsoft.EntityFrameworkCore; 

namespace ControleGastosAPI.Infrastructure.Repositories
{
    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly ConnectionContext _context;

        public TransacaoRepository(ConnectionContext context) => _context = context;

        public void Add(Transacao transacao)
        {
            _context.Transacoes.Add(transacao);
            _context.SaveChanges();
        }

        public List<Transacao> GetAll() => _context.Transacoes.AsNoTracking().ToList();

        public Transacao? GetById(Guid id) => _context.Transacoes.AsNoTracking().FirstOrDefault(t => t.id == id);

        public void Update(Transacao transacao)
        {
            _context.Entry(transacao).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Delete(Guid id)
        {
            var t = _context.Transacoes.Find(id);
            if (t != null)
            {
                _context.Transacoes.Remove(t);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Transacao> GetByPessoaId(Guid pessoaId)
            => _context.Transacoes.Where(t => t.pessoaid == pessoaId).AsNoTracking().ToList();
    }
}
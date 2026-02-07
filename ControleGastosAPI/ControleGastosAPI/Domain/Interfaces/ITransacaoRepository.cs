using ControleGastosAPI.Domain.Models;

namespace ControleGastosAPI.Domain.Interfaces
{
    public interface ITransacaoRepository
    {
        void Add(Transacao transacao);

        List<Transacao> GetAll();
        Transacao? GetById(Guid id); 

        void Update(Transacao transacao); 
        void Delete(Guid id);

        IEnumerable<Transacao> GetByPessoaId(Guid pessoaId);
    }
}
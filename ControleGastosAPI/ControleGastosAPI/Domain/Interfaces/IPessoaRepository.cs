using ControleGastosAPI.Domain.Models;

namespace ControleGastosAPI.Domain.Interfaces
{
    public interface IPessoaRepository
    {
        void Add(Pessoa pessoa);

        List<Pessoa> GetAll();
        Pessoa? GetById(Guid id);

        void Update(Pessoa pessoa);
        void Delete(Guid id);
    }
}
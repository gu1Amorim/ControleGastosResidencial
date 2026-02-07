using ControleGastosAPI.Domain.Models;

namespace ControleGastosAPI.Domain.Interfaces
{
    public interface ICategoriaRepository
    {
        void Add(Categoria categoria);

        List<Categoria> GetAll();
        Categoria? GetById(Guid id);

        void Delete(Guid id);
    }
}
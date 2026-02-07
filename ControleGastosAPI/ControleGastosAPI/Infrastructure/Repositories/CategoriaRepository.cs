using ControleGastosAPI.Domain.Models;
using ControleGastosAPI.Domain.Interfaces;

namespace ControleGastosAPI.Infrastructure.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly ConnectionContext _context;

        public CategoriaRepository(ConnectionContext context)
        {
            _context = context;
        }

        public void Add(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            _context.SaveChanges();
        }

        public List<Categoria> GetAll() => _context.Categorias.ToList();

        public Categoria? GetById(Guid id) => _context.Categorias.Find(id);

        public void Delete(Guid id)
        {
            var categoria = GetById(id);
            if (categoria != null)
            {
                _context.Categorias.Remove(categoria);
                _context.SaveChanges();
            }
        }
    }
}
using ControleGastosAPI.Attributes;
using ControleGastosAPI.Domain.Interfaces;
using ControleGastosAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaRepository _repository;

        public CategoriasController(ICategoriaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Categoria>), 200)]
        public IActionResult Get() => Ok(_repository.GetAll());

        [HttpPost]
        [ProducesResponseType(typeof(Categoria), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public IActionResult Post([FromBody] Categoria categoria)
        {
            if (string.IsNullOrEmpty(categoria.descricao))
            {
                return BadRequest("A descrição da categoria é obrigatória.");
            }

            if (categoria.id == Guid.Empty)
            {
                categoria.id = Guid.NewGuid();
            }

            _repository.Add(categoria);
            return CreatedAtAction(nameof(Get), new { id = categoria.id }, categoria);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)] 
        [ProducesResponseType(404)] 
        public IActionResult Delete(Guid id)
        {
            var categoria = _repository.GetById(id);
            if (categoria == null) return NotFound("Categoria não encontrada.");

            _repository.Delete(id);
            return NoContent();
        }
    }
}
using ControleGastosAPI.Attributes;
using ControleGastosAPI.Domain.Interfaces;
using ControleGastosAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaRepository _repository;

        public PessoasController(IPessoaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Pessoa>), 200)]
        public IActionResult Get() => Ok(_repository.GetAll());

        [HttpPost]
        [ProducesResponseType(typeof(Pessoa), 201)]
        [ProducesResponseType(401)]
        public IActionResult Post([FromBody] Pessoa pessoa)
        {
            _repository.Add(pessoa);
            return CreatedAtAction(nameof(Get), new { id = pessoa.id }, pessoa);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Pessoa), 200)] 
        [ProducesResponseType(400)] 
        [ProducesResponseType(404)] 
        public IActionResult Put(Guid id, [FromBody] Pessoa pessoa)
        {
            if (pessoa == null || id != pessoa.id)
                return BadRequest("Dados inconsistentes.");

            var pessoaExiste = _repository.GetById(id);
            if (pessoaExiste == null)
                return NotFound("Pessoa não encontrada.");

            _repository.Update(pessoa);

            return Ok(pessoa);
        }

// REQUISITO: Ao deletar uma pessoa, todas as transações vinculadas são removidas.
// O Entity Framework está configurado para Cascade Delete, garantindo a integridade dos dados.
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public IActionResult Delete(Guid id)
        {
            _repository.Delete(id);
            return Ok(new { message = "Pessoa e suas transações removidas com sucesso" });
        }
    }
}
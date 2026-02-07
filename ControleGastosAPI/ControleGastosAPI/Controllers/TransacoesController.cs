using ControleGastosAPI.Attributes;
using ControleGastosAPI.Domain.Interfaces;
using ControleGastosAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoRepository _transacaoRepo;
        private readonly TransacaoService _transacaoService;

        public TransacoesController(ITransacaoRepository transacaoRepo, TransacaoService transacaoService)
        {
            _transacaoRepo = transacaoRepo;
            _transacaoService = transacaoService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Transacao>), 200)]
        public IActionResult Get() => Ok(_transacaoRepo.GetAll());

        [HttpPost]
        public IActionResult Post([FromBody] Transacao transacao)
        {
            try
            {

                _transacaoService.SalvarTransacao(transacao);
                return CreatedAtAction(nameof(Get), new { id = transacao.id }, transacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult Put(Guid id, [FromBody] Transacao transacao)
        {
            try
            {
                transacao.id = id;
                _transacaoService.AtualizarTransacao(transacao);
                return Ok(transacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return NotFound("Transação não encontrada.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult Delete(Guid id)
        {
            var sucesso = _transacaoService.ExcluirTransacao(id);
            if (!sucesso) return NotFound("Transação não encontrada.");

            return NoContent();
        }
    }
}
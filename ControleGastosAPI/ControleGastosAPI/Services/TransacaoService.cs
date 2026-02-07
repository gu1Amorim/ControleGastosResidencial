using ControleGastosAPI.Domain.Interfaces;
using ControleGastosAPI.Domain.Models;

public class TransacaoService
{
    private readonly ITransacaoRepository _transacaoRepo;
    private readonly IPessoaRepository _pessoaRepo;
    private readonly ICategoriaRepository _categoriaRepo;

    public TransacaoService( ITransacaoRepository transacaoRepo,
                             IPessoaRepository pessoaRepo,
                             ICategoriaRepository categoriaRepo)
                            {
                                _transacaoRepo = transacaoRepo;
                                _pessoaRepo = pessoaRepo;
                                _categoriaRepo = categoriaRepo;
                            }

    public void SalvarTransacao(Transacao transacao)
    {
        ValidarRegras(transacao);
        _transacaoRepo.Add(transacao);
    }

    public void AtualizarTransacao(Transacao transacao)
    {
        var existente = _transacaoRepo.GetById(transacao.id);
        if (existente == null) throw new Exception("Transação não encontrada.");

        ValidarRegras(transacao);

        _transacaoRepo.Update(transacao);
    }

    public bool ExcluirTransacao(Guid id)
    {
        var transacao = _transacaoRepo.GetById(id);
        if (transacao == null) return false;

        _transacaoRepo.Delete(id);
        return true;
    }

    private void ValidarRegras(Transacao transacao)
    {
        // Validação de Pessoa
        var pessoa = _pessoaRepo.GetById(transacao.pessoaid);
        if (pessoa == null) throw new ArgumentException("Pessoa não encontrada.");

        if (pessoa.idade < 18 && transacao.tipo == 1)
            throw new ArgumentException("Menores de idade não podem cadastrar receitas.");

        // Validação de Categoria
        var categoria = _categoriaRepo.GetById(transacao.categoriaid);
        if (categoria == null) throw new ArgumentException("Categoria não encontrada.");

        if (transacao.tipo == 0 && categoria.finalidade == 1)
            throw new ArgumentException("Esta categoria é exclusiva para receitas.");

        if (transacao.tipo == 1 && categoria.finalidade == 0)
            throw new ArgumentException("Esta categoria é exclusiva para despesas.");

        // Validação de Valor
        if (transacao.valor <= 0)
            throw new ArgumentException("O valor da transação deve ser positivo.");
    }
}
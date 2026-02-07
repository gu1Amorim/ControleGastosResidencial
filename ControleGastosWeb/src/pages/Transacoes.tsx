import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Transacao, Pessoa, Categoria } from '../types';
import { 
  Loader2, Trash2, Edit2, PlusCircle, 
  AlertCircle, ArrowUpCircle, ArrowDownCircle, Wallet, HelpCircle, Tag 
} from 'lucide-react';

export const Transacoes = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  // Estados do Formulário e Exclusão
  const [idEdicao, setIdEdicao] = useState<string | null>(null);
  const [idExclusao, setIdExclusao] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<number>(1); 
  const [pessoaid, setPessoaid] = useState('');
  const [categoriaid, setCategoriaid] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resT, resP, resC] = await Promise.all([
        api.get<Transacao[]>('/Transacoes'),
        api.get<Pessoa[]>('/Pessoas'),
        api.get<Categoria[]>('/Categorias')
      ]);
      setTransacoes(resT.data);
      setPessoas(resP.data);
      setCategorias(resC.data);
    } catch (error) {
      setMsgErro("Não foi possível carregar os dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const totalReceitas = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
  const saldoGeral = totalReceitas - totalDespesas;

  const limparFormulario = () => {
    setIdEdicao(null);
    setDescricao('');
    setValor('');
    setTipo(1);
    setPessoaid('');
    setCategoriaid('');
    setMsgErro(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !pessoaid || !categoriaid) {
      setMsgErro("Por favor, preencha todos os campos antes de salvar.");
      return;
    }

    const pessoaSelecionada = pessoas.find(p => p.id === pessoaid);
    const categoriaSelecionada = categorias.find(c => c.id === categoriaid);

    if (pessoaSelecionada && categoriaSelecionada) {
      if (pessoaSelecionada.idade < 18 && tipo === 1) {
        setMsgErro(`Atenção: ${pessoaSelecionada.nome} é menor de idade e só pode registrar Despesas.`);
        return;
      }
      if (categoriaSelecionada.finalidade !== 2 && categoriaSelecionada.finalidade !== tipo) {
        const mensagem = categoriaSelecionada.finalidade === 1 
          ? "Esta categoria aceita apenas Receitas." 
          : "Esta categoria aceita apenas Despesas.";
        setMsgErro(`Atenção: ${mensagem}`);
        return;
      }
    }

    const dados = { descricao, valor: Number(valor), tipo, pessoaid, categoriaid };
    
    try {
      if (idEdicao) {
        await api.put(`/Transacoes/${idEdicao}`, dados);
      } else {
        await api.post('/Transacoes', dados);
      }
      limparFormulario();
      carregarDados();
    } catch (error: any) {
      setMsgErro(error.response?.data || "Erro ao processar transação.");
    }
  };

  const handleEditar = (t: Transacao) => {
    setIdEdicao(t.id || null);
    setDescricao(t.descricao);
    setValor(t.valor);
    setTipo(t.tipo);
    setPessoaid(t.pessoaid);
    setCategoriaid(t.categoriaid);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmarExclusao = async () => {
    if (!idExclusao) return;
    try {
      await api.delete(`/Transacoes/${idExclusao}`);
      setIdExclusao(null);
      carregarDados();
    } catch (error) {
      setMsgErro("Erro ao excluir.");
      setIdExclusao(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* MODAL DE EXCLUSÃO */}
      {idExclusao && (
        <div style={overlayStyle}>
          <div style={modalConfirmStyle}>
            <HelpCircle size={48} color="#e74c3c" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Confirmar Exclusão</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '25px' }}>
              Tem certeza que deseja excluir esta transação?
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={() => setIdExclusao(null)} style={{ ...btnStyle, background: '#bdc3c7', flex: 1 }}>Cancelar</button>
              <button onClick={confirmarExclusao} style={{ ...btnStyle, background: '#e74c3c', flex: 1 }}>Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50', fontSize: '28px', fontWeight: '700', margin: 0 }}>
          <Wallet size={32} color="#3498db" /> Gestão de Transações
        </h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={cardMiniStyle}>
            <span style={{ fontSize: '10px', color: '#7f8c8d', fontWeight: 'bold' }}>ENTRADAS</span>
            <strong style={{ color: '#27ae60', fontSize: '18px' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitas)}
            </strong>
          </div>
          <div style={cardMiniStyle}>
            <span style={{ fontSize: '10px', color: '#7f8c8d', fontWeight: 'bold' }}>SAÍDAS</span>
            <strong style={{ color: '#e74c3c', fontSize: '18px' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDespesas)}
            </strong>
          </div>
        </div>
      </div>

      {msgErro && (
        <div style={modalErroStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{msgErro}</span>
          </div>
          <button onClick={() => setMsgErro(null)} style={closeBtnStyle}>&times;</button>
        </div>
      )}

      {/* FORMULÁRIO */}
      <div style={containerFormStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: idEdicao ? '#f39c12' : '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {idEdicao ? <Edit2 size={20} /> : <PlusCircle size={20} />}
          {idEdicao ? "Editar Transação" : "Nova Transação"}
        </h3>
        
        <form onSubmit={handleSalvar} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Descrição</label>
            <input maxLength={400} placeholder="Ex: Mercado..." value={descricao} onChange={e => setDescricao(e.target.value)} style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Valor</label>
            <input type="number" step="0.01" placeholder="0,00" value={valor} onChange={e => setValor(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Tipo</label>
            <select value={tipo} onChange={e => setTipo(Number(e.target.value))} style={{...inputStyle, borderLeft: `5px solid ${tipo === 1 ? '#27ae60' : '#e74c3c'}`}}>
              <option value={1}>📈 Receita</option>
              <option value={0}>📉 Despesa</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Pessoa</label>
            <select value={pessoaid} onChange={e => setPessoaid(e.target.value)} style={inputStyle}>
              <option value="">Selecione...</option>
              {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>)}
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Categoria</label>
            <select value={categoriaid} onChange={e => setCategoriaid(e.target.value)} style={inputStyle}>
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button type="submit" style={{ ...btnStyle, background: idEdicao ? '#f39c12' : '#27ae60' }}>
              {idEdicao ? 'Atualizar' : 'Salvar'}
            </button>
            {idEdicao && (
              <button type="button" onClick={limparFormulario} style={{ ...btnStyle, background: '#95a5a6' }}>Sair</button>
            )}
          </div>
        </form>
      </div>

      {/* TABELA COM O TOTAL DE VOLTA NO LADO DO TÍTULO */}
      <div style={containerTableStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Histórico de Lançamentos</h3>
          {/* ESTE É O TOTAL QUE TINHA SUMIDO */}
          <span style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px 15px', borderRadius: '8px', background: saldoGeral >= 0 ? '#eafaf1' : '#fdedec', color: saldoGeral >= 0 ? '#27ae60' : '#e74c3c' }}>
            Saldo Geral: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoGeral)}
          </span>
        </div>

        {loading ? <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#f8f9fa', color: '#7f8c8d' }}>
                  <th style={thStyle}>DESCRIÇÃO</th>
                  <th style={thStyle}>CATEGORIA</th>
                  <th style={thStyle}>PESSOA</th>
                  <th style={thStyle}>TIPO</th>
                  <th style={thStyle}>VALOR</th>
                  <th style={thStyle}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(t => {
                  const pessoa = pessoas.find(p => p.id === t.pessoaid);
                  const primeiroNome = pessoa ? pessoa.nome.split(' ')[0] : '---';
                  const categoriaDesc = categorias.find(c => c.id === t.categoriaid)?.descricao || '---';

                  return (
                    <tr key={t.id} style={trStyle}>
                      <td style={tdStyle}><strong>{t.descricao}</strong></td>
                      <td style={tdStyle}>
                         <span style={{ fontSize: '13px', color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Tag size={12} /> {categoriaDesc}
                         </span>
                      </td>
                      <td style={tdStyle}>{primeiroNome}</td>
                      <td style={tdStyle}>
                        <span style={t.tipo === 1 ? badgeReceita : badgeDespesa}>
                          {t.tipo === 1 ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                          {t.tipo === 1 ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: t.tipo === 1 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEditar(t)} style={actionBtn}><Edit2 size={16} color="#2980b9" /></button>
                        <button onClick={() => setIdExclusao(t.id!)} style={actionBtn}><Trash2 size={16} color="#e74c3c" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS MANTIDOS ---
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalConfirmStyle: React.CSSProperties = { background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const cardMiniStyle: React.CSSProperties = { background: 'white', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', border: '1px solid #eee', minWidth: '140px', alignItems: 'center' };
const modalErroStyle: React.CSSProperties = { background: '#fdedec', color: '#c0392b', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fadbd8', fontWeight: '500' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#c0392b', lineHeight: '1' };
const containerFormStyle: React.CSSProperties = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' };
const formStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' };
const inputGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 'bold', color: '#95a5a6', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', outline: 'none' };
const btnStyle: React.CSSProperties = { padding: '12px 20px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const containerTableStyle: React.CSSProperties = { background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: React.CSSProperties = { padding: '15px 20px', textAlign: 'left', fontSize: '12px', color: '#7f8c8d', borderBottom: '1px solid #eee' };
const tdStyle: React.CSSProperties = { padding: '15px 20px' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #f8f9fa' };
const actionBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' };
const badgeReceita: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eafaf1', color: '#27ae60', padding: '5px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' };
const badgeDespesa: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fdedec', color: '#e74c3c', padding: '5px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' };
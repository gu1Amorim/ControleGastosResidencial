import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Pessoa, Transacao } from '../types';
import { 
  UserPlus, Trash2, Loader2, AlertCircle, 
  Users, Edit2, XCircle, HelpCircle
} from 'lucide-react';

export const Pessoas = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]); 
  const [loading, setLoading] = useState(true);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  
  // Estados para o formulário e exclusão
  const [idEdicao, setIdEdicao] = useState<string | null>(null);
  const [idExclusao, setIdExclusao] = useState<string | null>(null); // Novo estado para o Modal
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resP, resT] = await Promise.all([
        api.get<Pessoa[]>('/Pessoas'),
        api.get<Transacao[]>('/Transacoes')
      ]);
      setPessoas(resP.data);
      setTransacoes(resT.data);
    } catch (error) {
      setMsgErro("Erro ao carregar dados. O servidor está online?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleSalvar = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!nome || !idade) {
      setMsgErro("Preencha o nome e a idade!");
      return;
  }

  try {
    const dados = { 
      id: idEdicao || undefined, 
      nome, 
      idade: Number(idade) 
    };

    if (idEdicao) {
      await api.put(`/Pessoas/${idEdicao}`, dados);
    } else {
      await api.post('/Pessoas', dados);
    }
    cancelarEdicao();
    carregarDados();
  } catch (error: any) {
    setMsgErro(error.response?.data || "Erro ao processar.");
  }
};

  const handleEditar = (p: Pessoa) => {
    setIdEdicao(p.id!);
    setNome(p.nome);
    setIdade(p.idade);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setIdEdicao(null);
    setNome('');
    setIdade('');
    setMsgErro(null);
  };

  // Funções de Exclusão com Modal Customizado
  const confirmarExclusao = async () => {
    if (!idExclusao) return;
    try {
      await api.delete(`/Pessoas/${idExclusao}`);
      setIdExclusao(null);
      carregarDados();
    } catch (error) {
      setMsgErro("Erro ao excluir pessoa.");
      setIdExclusao(null);
    }
  };

  const calcularTotais = (pessoaId: string) => {
    const tPessoa = transacoes.filter(t => t.pessoaid === pessoaId);
    const receita = tPessoa.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
    const despesa = tPessoa.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
    return { receita, despesa, saldo: receita - despesa };
  };

  const totalGeralReceita = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
  const totalGeralDespesa = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);

  const formatar = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* MODAL DE CONFIRMAÇÃO PERSONALIZADO */}
      {idExclusao && (
        <div style={overlayStyle}>
          <div style={modalConfirmStyle}>
            <HelpCircle size={48} color="#e74c3c" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Excluir Pessoa?</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
              Atenção: Ao excluir esta pessoa, <strong>todas as suas transações</strong> vinculadas também serão removidas. Confirmar?
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={() => setIdExclusao(null)} style={{ ...btnSalvarStyle, background: '#bdc3c7', flex: 1, justifyContent: 'center' }}>Cancelar</button>
              <button onClick={confirmarExclusao} style={{ ...btnSalvarStyle, background: '#e74c3c', flex: 1, justifyContent: 'center' }}>Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PADRONIZADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50', fontSize: '28px', fontWeight: '700', margin: 0 }}>
          <Users size={32} color="#3498db" /> Gestão de Pessoas
        </h1>
        <div style={cardMiniStyle}>
            <span style={{fontSize: '10px', color: '#7f8c8d', fontWeight: 'bold'}}>TOTAL CADASTRADO</span>
            <span style={{color: '#3498db', fontWeight: 'bold', fontSize: '18px'}}>{pessoas.length}</span>
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

      {/* FORMULÁRIO (ADD/EDIT) */}
      <div style={containerFormStyle}>
        <h3 style={{marginTop: 0, marginBottom: '15px', fontSize: '16px', color: idEdicao ? '#f39c12' : '#2c3e50'}}>
          {idEdicao ? 'Editando Pessoa' : 'Nova Pessoa'}
        </h3>
        <form onSubmit={handleSalvar} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 3, minWidth: '250px' }}>
            <label style={labelStyle}>Nome Completo</label>
            <input placeholder="Ex: João Silva" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} maxLength={200} />
          </div>
          <div style={{ flex: 1, minWidth: '100px' }}>
            <label style={labelStyle}>Idade</label>
            <input type="number" placeholder="0" value={idade} onChange={e => setIdade(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ ...btnSalvarStyle, background: idEdicao ? '#f39c12' : '#27ae60' }}>
              {idEdicao ? <Edit2 size={18} /> : <UserPlus size={18} />} {idEdicao ? 'Atualizar' : 'Cadastrar'}
            </button>
            {idEdicao && (
              <button type="button" onClick={cancelarEdicao} style={{ ...btnSalvarStyle, background: '#95a5a6' }}>
                <XCircle size={18} /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={containerTableStyle}>
        <div style={{padding: '20px', borderBottom: '1px solid #eee'}}>
          <h3 style={{margin: 0, fontSize: '16px'}}>Detalhamento de Saldos por Pessoa</h3>
        </div>
        {loading ? (
            <div style={{padding: '40px', textAlign: 'center'}}><Loader2 className="animate-spin" /></div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={thStyle}>PESSOA</th>
                  <th style={thStyle}>RECEITAS</th>
                  <th style={thStyle}>DESPESAS</th>
                  <th style={thStyle}>SALDO</th>
                  <th style={thStyle}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map(p => {
                  const totais = calcularTotais(p.id!);
                  return (
                    <tr key={p.id} style={trStyle}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{p.nome}</span>
                            <span style={{ fontSize: '11px', color: '#7f8c8d' }}>{p.idade} anos</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: '#27ae60' }}>{formatar(totais.receita)}</td>
                      <td style={{ ...tdStyle, color: '#e74c3c' }}>{formatar(totais.despesa)}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: totais.saldo >= 0 ? '#27ae60' : '#e74c3c' }}>
                        {formatar(totais.saldo)}
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEditar(p)} style={{...actionBtn, color: '#3498db'}}><Edit2 size={18} /></button>
                        <button onClick={() => setIdExclusao(p.id!)} style={{...actionBtn, color: '#e74c3c'}}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f1f2f6', fontWeight: 'bold' }}>
                  <td style={tdStyle}>TOTAL GERAL</td>
                  <td style={{ ...tdStyle, color: '#27ae60' }}>{formatar(totalGeralReceita)}</td>
                  <td style={{ ...tdStyle, color: '#e74c3c' }}>{formatar(totalGeralDespesa)}</td>
                  <td style={{ ...tdStyle, color: '#2c3e50' }} colSpan={2}>{formatar(totalGeralReceita - totalGeralDespesa)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS DO MODAL ---
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalConfirmStyle: React.CSSProperties = { background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' };

// ESTILOS (MANTIDOS)
const cardMiniStyle: React.CSSProperties = { background: 'white', padding: '10px 20px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', minWidth: '140px' };
const modalErroStyle: React.CSSProperties = { background: '#fdedec', color: '#c0392b', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fadbd8', fontWeight: '500' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#c0392b', lineHeight: '1' };
const containerFormStyle: React.CSSProperties = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#95a5a6', marginBottom: '8px', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', width: '100%', outline: 'none', boxSizing: 'border-box', fontSize: '14px' };
const btnSalvarStyle: React.CSSProperties = { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px' };
const containerTableStyle: React.CSSProperties = { background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' };
const thStyle: React.CSSProperties = { padding: '15px 20px', fontSize: '11px', color: '#7f8c8d', borderBottom: '1px solid #eee', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '15px 20px', fontSize: '14px' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #f8f9fa' };
const actionBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' };
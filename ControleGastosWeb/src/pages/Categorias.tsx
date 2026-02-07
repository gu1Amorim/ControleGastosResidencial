import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Categoria, Transacao } from '../types';
import { Tag, PlusCircle, Trash2, Loader2, AlertCircle, ListTree, HelpCircle } from 'lucide-react';

export const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]); 
  const [loading, setLoading] = useState(true);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<number>(1); 
  const [idExclusao, setIdExclusao] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resCat, resTrans] = await Promise.all([
        api.get<Categoria[]>('/Categorias'),
        api.get<Transacao[]>('/Transacoes')
      ]);
      setCategorias(resCat.data);
      setTransacoes(resTrans.data);
    } catch (error) {
      setMsgErro("Erro ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao) {
        setMsgErro("Digite uma descrição para a categoria!");
        return;
    }

    try {
      await api.post('/Categorias', { descricao, finalidade });
      setDescricao('');
      setMsgErro(null);
      carregarDados();
    } catch (error: any) {
      setMsgErro(error.response?.data || "Erro ao salvar categoria.");
    }
  };

  // FUNÇÃO DE EXCLUSÃO COM VALIDAÇÃO DE INTEGRIDADE
  const confirmarExclusao = async () => {
    if (!idExclusao) return;

    // Validação local: verifica se existe alguma transação usando esta categoria
    const temTransacoes = transacoes.some(t => t.categoriaid === idExclusao);

    if (temTransacoes) {
      setMsgErro("Não é permitido excluir uma categoria que possui transações vinculadas!");
      setIdExclusao(null);
      return;
    }

    try {
      await api.delete(`/Categorias/${idExclusao}`);
      setIdExclusao(null);
      setMsgErro(null); // Limpa erros anteriores se houver sucesso
      carregarDados();
    } catch (error: any) {
      setMsgErro(error.response?.data || "Erro ao excluir. Verifique a conexão com o servidor.");
      setIdExclusao(null);
    }
  };

  const calcularTotaisCategoria = (catId: string) => {
    const filtradas = transacoes.filter(t => t.categoriaid === catId);
    const receita = filtradas.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
    const despesa = filtradas.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
    return { receita, despesa, saldo: receita - despesa };
  };

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const totalReceitas = categorias.filter(c => c.finalidade === 1 || c.finalidade === 2).length;
  const totalDespesas = categorias.filter(c => c.finalidade === 0 || c.finalidade === 2).length;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* MODAL DE CONFIRMAÇÃO PERSONALIZADO */}
      {idExclusao && (
        <div style={overlayStyle}>
          <div style={modalConfirmStyle}>
            <HelpCircle size={48} color="#e74c3c" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Excluir Categoria?</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
              Tem certeza que deseja remover esta categoria? <br/>
              <strong>Nota:</strong> A exclusão será bloqueada se houverem lançamentos nela.
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
          <ListTree size={32} color="#3498db" /> Gestão de Categorias
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={cardMiniStyle}>
                <span style={{fontSize: '10px', color: '#7f8c8d', fontWeight: 'bold'}}>REC / AMBAS</span>
                <span style={{color: '#27ae60', fontWeight: 'bold', fontSize: '18px'}}>{totalReceitas}</span>
            </div>
            <div style={cardMiniStyle}>
                <span style={{fontSize: '10px', color: '#7f8c8d', fontWeight: 'bold'}}>DESP / AMBAS</span>
                <span style={{color: '#e74c3c', fontWeight: 'bold', fontSize: '18px'}}>{totalDespesas}</span>
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

      {/* FORMULÁRIO DE CADASTRO */}
      <div style={containerFormStyle}>
        <form onSubmit={handleSalvar} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={labelStyle}>Nome da Categoria (Máx 400)</label>
            <input 
              placeholder="Ex: Alimentação, Lazer..." 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              style={inputStyle}
              maxLength={400} 
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}>Finalidade</label>
            <select 
              value={finalidade} 
              onChange={e => setFinalidade(Number(e.target.value))}
              style={{...inputStyle, borderLeft: `5px solid ${finalidade === 1 ? '#27ae60' : finalidade === 0 ? '#e74c3c' : '#95a5a6'}`}}
            >
              <option value={1}>📈 Receita</option>
              <option value={0}>📉 Despesa</option>
              <option value={2}>🔄 Ambas</option>
            </select>
          </div>

          <button type="submit" style={btnSalvarStyle}>
            <PlusCircle size={18} /> Adicionar
          </button>
        </form>
      </div>

      <div style={containerTableStyle}>
        {loading ? (
            <div style={{padding: '40px', textAlign: 'center'}}><Loader2 className="animate-spin" /></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={thStyle}>DESCRIÇÃO / TIPO</th>
                <th style={thStyle}>REC. TOTAL</th>
                <th style={thStyle}>DESP. TOTAL</th>
                <th style={thStyle}>SALDO</th>
                <th style={thStyle}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => {
                const totais = calcularTotaisCategoria(cat.id!);
                return (
                  <tr key={cat.id} style={trStyle}>
                    <td style={tdStyle}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Tag size={14} color="#95a5a6" />
                            <strong>{cat.descricao}</strong>
                          </div>
                          <div>
                            {cat.finalidade === 1 && <span style={badgeReceita}>Receita</span>}
                            {cat.finalidade === 0 && <span style={badgeDespesa}>Despesa</span>}
                            {cat.finalidade === 2 && <span style={badgeAmbas}>Ambas</span>}
                          </div>
                      </div>
                    </td>
                    <td style={{...tdStyle, color: '#27ae60'}}>{formatarMoeda(totais.receita)}</td>
                    <td style={{...tdStyle, color: '#e74c3c'}}>{formatarMoeda(totais.despesa)}</td>
                    <td style={{...tdStyle, fontWeight: 'bold', color: totais.saldo >= 0 ? '#2c3e50' : '#e74c3c'}}>
                      {formatarMoeda(totais.saldo)}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => setIdExclusao(cat.id!)} style={deleteBtnStyle} title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalConfirmStyle: React.CSSProperties = { background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const badgeAmbas: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', background: '#f1f2f6', color: '#57606f', padding: '2px 10px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' };
const badgeReceita: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eafaf1', color: '#27ae60', padding: '2px 10px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' };
const badgeDespesa: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fdedec', color: '#e74c3c', padding: '2px 10px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' };
const cardMiniStyle: React.CSSProperties = { background: 'white', padding: '10px 15px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' };
const modalErroStyle: React.CSSProperties = { background: '#fdedec', color: '#c0392b', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fadbd8', fontWeight: '500' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#c0392b', lineHeight: '1' };
const containerFormStyle: React.CSSProperties = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#95a5a6', marginBottom: '8px', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', width: '100%', outline: 'none', boxSizing: 'border-box', fontSize: '14px' };
const btnSalvarStyle: React.CSSProperties = { padding: '12px 25px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px' };
const containerTableStyle: React.CSSProperties = { background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' };
const thStyle: React.CSSProperties = { padding: '15px 20px', fontSize: '11px', color: '#7f8c8d', borderBottom: '1px solid #eee', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '15px 20px' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #f8f9fa' };
const deleteBtnStyle: React.CSSProperties = { color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', opacity: 0.8 };
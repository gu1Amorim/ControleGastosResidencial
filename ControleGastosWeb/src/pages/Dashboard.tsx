import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Transacao, Categoria, Pessoa } from '../types';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  Clock, LayoutDashboard, Users, Tag,
  AlertCircle, ArrowRightLeft
} from 'lucide-react';

export const Dashboard = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resT, resC, resP] = await Promise.all([
          api.get<Transacao[]>('/Transacoes'),
          api.get<Categoria[]>('/Categorias'),
          api.get<Pessoa[]>('/Pessoas')
        ]);
        setTransacoes(resT.data);
        setCategorias(resC.data);
        setPessoas(resP.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CÁLCULOS TÉCNICOS (REGRAS DE NEGÓCIO) ---
  const receitasTotais = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
  const despesasTotais = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
  const saldoGeral = receitasTotais - despesasTotais;
  
  // Lógica para a Consulta por Pessoa (Exigido no Requisito)
  const totaisPorPessoa = pessoas.map(p => {
    const tPessoa = transacoes.filter(t => t.pessoaid === p.id);
    const rec = tPessoa.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0);
    const desp = tPessoa.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0);
    return { nome: p.nome, rec, desp, saldo: rec - desp };
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading) return (
    <div style={{padding: '100px', textAlign: 'center', color: '#3498db'}}>
      <Clock className="animate-spin" size={48} style={{margin: '0 auto'}} />
      <p>Carregando panorama financeiro...</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50', fontSize: '28px', fontWeight: '800', margin: 0 }}>
          <LayoutDashboard size={32} color="#3498db" /> Dashboard Geral
        </h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0 0 44px', fontSize: '14px' }}>Consolidado de movimentações e saldos por pessoa.</p>
      </div>

      {/* CARDS DE RESUMO (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={kpiCardStyle('#27ae60')}>
          <div style={kpiHeader}><span>Total Receitas</span> <TrendingUp size={20} /></div>
          <h2 style={kpiValue}>{formatCurrency(receitasTotais)}</h2>
        </div>

        <div style={kpiCardStyle('#e74c3c')}>
          <div style={kpiHeader}><span>Total Despesas</span> <TrendingDown size={20} /></div>
          <h2 style={kpiValue}>{formatCurrency(despesasTotais)}</h2>
        </div>

        <div style={kpiCardStyle(saldoGeral >= 0 ? '#3498db' : '#f39c12')}>
          <div style={kpiHeader}><span>Saldo Líquido</span> <DollarSign size={20} /></div>
          <h2 style={kpiValue}>{formatCurrency(saldoGeral)}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* LISTAGEM DE TOTAIS POR PESSOA (REQUISITO OBRIGATÓRIO) */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}><Users size={20} /> Totais por Pessoa</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#95a5a6', fontSize: '12px' }}>
                  <th style={thStyle}>NOME</th>
                  <th style={thStyle}>RECEITAS</th>
                  <th style={thStyle}>DESPESAS</th>
                  <th style={thStyle}>SALDO</th>
                </tr>
              </thead>
              <tbody>
                {totaisPorPessoa.map((tp, idx) => (
                  <tr key={idx} style={trStyle}>
                    <td style={tdStyle}><strong>{tp.nome}</strong></td>
                    <td style={{ ...tdStyle, color: '#27ae60' }}>{formatCurrency(tp.rec)}</td>
                    <td style={{ ...tdStyle, color: '#e74c3c' }}>{formatCurrency(tp.desp)}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: tp.saldo >= 0 ? '#2c3e50' : '#e74c3c' }}>
                      {formatCurrency(tp.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totaisPorPessoa.length === 0 && (
              <div style={emptyState}><AlertCircle size={16}/> Nenhuma pessoa cadastrada</div>
            )}
          </div>
        </div>

        {/* RESUMO DE ESTRUTURA E DICAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={sectionStyle}>
            <h3 style={sectionTitle}><ArrowRightLeft size={20} /> Resumo do Sistema</h3>
            <div style={infoRow}>
              <span>Categorias Cadastradas:</span>
              <strong>{categorias.length}</strong>
            </div>
            <div style={infoRow}>
              <span>Total de Transações:</span>
              <strong>{transacoes.length}</strong>
            </div>
            <div style={{...tipBox, background: saldoGeral < 0 ? '#fff5f5' : '#f0f9ff', borderColor: saldoGeral < 0 ? '#e74c3c' : '#3498db'}}>
               <p style={{margin: 0, fontSize: '13px', color: '#2c3e50'}}>
                <strong>Análise de Saúde:</strong> {saldoGeral < 0 
                  ? "Atenção! Suas despesas superam as receitas. Revise os gastos por categoria." 
                  : "Parabéns! O saldo geral da residência está positivo."}
              </p>
            </div>
          </div>
          
          <div style={sectionStyle}>
             <h3 style={sectionTitle}><Tag size={20} /> Distribuição</h3>
             <p style={{fontSize: '13px', color: '#7f8c8d'}}>
               Utilize as abas de Transações e Categorias para gerenciar detalhadamente cada lançamento.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- ESTILOS ---
const kpiCardStyle = (color: string): React.CSSProperties => ({
  background: 'white', padding: '25px', borderRadius: '15px', borderLeft: `6px solid ${color}`,
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '10px'
});
const kpiHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', color: '#95a5a6', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' };
const kpiValue: React.CSSProperties = { margin: 0, fontSize: '28px', color: '#2c3e50', fontWeight: '800' };

const sectionStyle: React.CSSProperties = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const sectionTitle: React.CSSProperties = { margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' };

const thStyle: React.CSSProperties = { padding: '12px 10px', borderBottom: '1px solid #eee' };
const tdStyle: React.CSSProperties = { padding: '12px 10px', fontSize: '14px' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #f8f9fa' };

const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8f9fa', fontSize: '14px' };
const tipBox: React.CSSProperties = { marginTop: '20px', padding: '15px', borderRadius: '10px', borderLeft: '4px solid' };
const emptyState: React.CSSProperties = { padding: '20px', textAlign: 'center', color: '#bdc3c7', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
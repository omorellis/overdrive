'use client';

import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, ArrowRight, ArrowLeft, Wrench, Clock, AlertCircle, CheckCircle2, CheckSquare } from 'lucide-react';

const COLUNAS = [
  { id: 'AGUARDANDO', nome: 'Aguardando', cor: 'border-t-blue-500 bg-blue-500/5 text-blue-400', icone: <Clock size={16} /> },
  { id: 'BANCADA', nome: 'Em Bancada', cor: 'border-t-orange-500 bg-orange-500/5 text-orange-400', icone: <Wrench size={16} /> },
  { id: 'PEÇA', nome: 'Aguardando Peça', cor: 'border-t-red-500 bg-red-500/5 text-red-400', icone: <AlertCircle size={16} /> },
  { id: 'FINALIZADO', nome: 'Pronto / Testado', cor: 'border-t-emerald-500 bg-emerald-500/5 text-emerald-400', icone: <CheckCircle2 size={16} /> }
];

export default function OrdensPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [clienteId, setClienteId] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [defeito, setDefeito] = useState('');

  useEffect(() => {
    fetchClientes();
    fetchOrdens();
  }, []);

  const fetchClientes = async () => {
    const res = await fetch('/api/clientes');
    setClientes(await res.json());
  };

  const fetchOrdens = async () => {
    const res = await fetch('/api/ordens');
    setOrdens(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return alert("Selecione o cliente!");
    setLoading(true);

    await fetch('/api/ordens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clienteId, equipamento, defeito })
    });

    setClienteId('');
    setEquipamento('');
    setDefeito('');
    fetchOrdens();
    setLoading(false);
  };

  const mudarStatus = async (id: string, atualStatus: string, direcao: 'AVANCAR' | 'VOLTAR') => {
    const statusOrdem = ['AGUARDANDO', 'BANCADA', 'PEÇA', 'FINALIZADO'];
    let index = statusOrdem.indexOf(atualStatus);
    
    if (direcao === 'AVANCAR' && index < statusOrdem.length - 1) index++;
    if (direcao === 'VOLTAR' && index > 0) index--;

    await fetch(`/api/ordens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusOrdem[index] })
    });
    fetchOrdens();
  };

  // Nova função para arquivar a OS (Some do quadro, mas fica no banco)
  const entregarOrdem = async (id: string) => {
    if (confirm('Marcar o painel como ENTREGUE? Ele sairá do quadro de produção e ficará salvo no histórico.')) {
      await fetch(`/api/ordens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENTREGUE' })
      });
      fetchOrdens();
    }
  };

  const excluirOrdem = async (id: string) => {
    if (confirm('DELETAR esta Ordem? Use isso apenas se cadastrou errado. Para finalizar o serviço, use o botão Entregar.')) {
      await fetch(`/api/ordens/${id}`, { method: 'DELETE' });
      fetchOrdens();
    }
  };

  return (
    <div className="p-8 max-w-[1700px] mx-auto font-sans text-zinc-100 h-full flex flex-col">
      
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Layers className="text-emerald-500" size={32} /> Painel de Produção (OS)
        </h1>
        <p className="text-zinc-400 mt-1">Acompanhe o fluxo de reparos e customizações na bancada.</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-8 flex-shrink-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Cliente</label>
            <select required value={clienteId} onChange={e => setClienteId(e.target.value)}
              className="w-full p-2 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm">
              <option value="">Selecione o cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Equipamento / Painel</label>
            <input required type="text" value={equipamento} onChange={e => setEquipamento(e.target.value)} placeholder="Ex: Painel Fazer 250 Blueflex"
              className="w-full p-2 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Defeito Relatado</label>
            <input required type="text" value={defeito} onChange={e => setDefeito(e.target.value)} placeholder="Ex: Não marca marcha / Display falhando"
              className="w-full p-2 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
          </div>
          <button disabled={loading} type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-md">
            <Plus size={16} /> Abrir O.S.
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 overflow-hidden min-h-[500px]">
        {COLUNAS.map(col => {
          const ordensDaColuna = ordens.filter(o => o.status === col.id);
          
          return (
            <div key={col.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col max-h-[650px]">
              
              <div className={`p-4 border-t-4 border-b border-zinc-800 rounded-t-xl flex justify-between items-center ${col.cor}`}>
                <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                  {col.icone} {col.nome}
                </div>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                  {ordensDaColuna.length}
                </span>
              </div>

              <div className="p-3 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                {ordensDaColuna.map(os => (
                  <div key={os.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-zinc-100 text-sm">{os.equipamento}</h4>
                      <button onClick={() => excluirOrdem(os.id)} title="Excluir Definitivamente" className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-zinc-400"><span className="font-semibold text-zinc-500">Cliente:</span> {os.cliente?.nome}</p>
                    <p className="text-xs text-zinc-400 mt-1 bg-zinc-950 p-2 rounded border border-zinc-800 italic">
                      "{os.defeito}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
                      
                      {/* Lógica condicional: Se estiver FINALIZADO, mostra botão de Entregar. Senão, mostra setas de fluxo */}
                      {os.status === 'FINALIZADO' ? (
                        <button onClick={() => entregarOrdem(os.id)} 
                          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold py-2 rounded flex items-center justify-center gap-2 text-xs transition-colors">
                          <CheckSquare size={14} /> Entregar ao Cliente
                        </button>
                      ) : (
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={() => mudarStatus(os.id, os.status, 'VOLTAR')}
                            disabled={os.status === 'AGUARDANDO'}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 disabled:opacity-20 transition-colors"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          
                          <span className="text-[10px] text-zinc-500 font-medium">Atalhos de Fluxo</span>

                          <button 
                            onClick={() => mudarStatus(os.id, os.status, 'AVANCAR')}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}

                {ordensDaColuna.length === 0 && (
                  <p className="text-zinc-600 text-xs italic text-center py-8">Nenhum painel aqui.</p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Search, Briefcase, User, Edit2, X, Save } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

  // Estados do Formulário e Edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telefone, setTelefone] = useState('');
  const [motos, setMotos] = useState('');
  const [isOficina, setIsOficina] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      setClientes(await res.json());
    } catch (err) {
      console.error("Erro ao buscar clientes", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const motosFinal = isOficina && motos.trim() === '' ? 'Oficina Parceira (Múltiplos)' : motos;
    const payload = { nome, whatsapp, telefone, motos: motosFinal };

    try {
      if (modoEdicao && idEdicao) {
        // Atualizar cliente existente
        await fetch(`/api/clientes/${idEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Criar novo cliente
        await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      cancelarEdicao(); // Limpa o form
      fetchClientes();
    } catch (error) {
      alert("Erro ao salvar cliente.");
    }
    setLoading(false);
  };

  const carregarParaEdicao = (cliente: any) => {
    setModoEdicao(true);
    setIdEdicao(cliente.id);
    setNome(cliente.nome);
    setWhatsapp(cliente.whatsapp);
    setTelefone(cliente.telefone || '');
    
    // Verifica se tem tag de oficina para ajustar a chavinha
    const ehOficina = cliente.motos?.includes('Oficina');
    setIsOficina(ehOficina);
    
    // Se for o texto padrão de oficina, deixa o campo limpo pra não confundir
    if (ehOficina && cliente.motos === 'Oficina Parceira (Múltiplos)') {
      setMotos('');
    } else {
      setMotos(cliente.motos || '');
    }
    
    // Rola a tela pro topo onde tá o form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setNome('');
    setWhatsapp('');
    setTelefone('');
    setMotos('');
    setIsOficina(false);
  };

  const excluirCliente = async (id: string) => {
    if (confirm('Deletar este cliente? Os orçamentos atrelados a ele podem perder a referência.')) {
      await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      fetchClientes();
      if (id === idEdicao) cancelarEdicao();
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (c.motos && c.motos.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans text-zinc-100">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-emerald-500" size={32} /> Módulo de Clientes
        </h1>
        <p className="text-zinc-400 mt-1">Gestão de contatos, oficinas parceiras e motos da sua base.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="xl:col-span-4 h-fit">
          <div className={`bg-zinc-900 border rounded-xl p-6 shadow-xl relative transition-colors duration-300 ${modoEdicao ? 'border-blue-500/50 shadow-blue-900/10' : 'border-zinc-800'}`}>
            
            {modoEdicao && (
              <div className="absolute top-0 left-0 w-full bg-blue-900/30 border-b border-blue-900/50 p-2 flex justify-between items-center rounded-t-xl">
                <span className="text-xs font-bold text-blue-400 uppercase ml-4 flex items-center gap-2">
                  <Edit2 size={12}/> Editando Cliente
                </span>
                <button onClick={cancelarEdicao} className="text-zinc-400 hover:text-white mr-2"><X size={16}/></button>
              </div>
            )}

            <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 text-zinc-100 ${modoEdicao ? 'mt-8' : ''}`}>
              {modoEdicao ? <Edit2 className="text-blue-500" size={20} /> : <Plus className="text-emerald-500" size={20} />} 
              {modoEdicao ? 'Atualizar Dados' : 'Novo Cadastro'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 flex gap-1 mb-4">
                <button type="button" onClick={() => setIsOficina(false)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 ${!isOficina ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <User size={14} /> Cliente Final
                </button>
                <button type="button" onClick={() => { setIsOficina(true); setMotos(''); }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 ${isOficina ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <Briefcase size={14} /> Lojista / Oficina
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">
                  {isOficina ? 'Nome da Oficina' : 'Nome Completo'}
                </label>
                <input required type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder={isOficina ? "Ex: Oficina Garagem 395" : "Ex: João da Silva"}
                  className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">WhatsApp</label>
                  <input required type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(24) 99999-9999"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Tel. Fixo/Extra</label>
                  <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(Opcional)"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
                </div>
              </div>

              {!isOficina ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Modelo das Motos</label>
                  <input type="text" value={motos} onChange={e => setMotos(e.target.value)} placeholder="Ex: Fazer 250 (2018), CG Titan 160"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Especialidade (Opcional)</label>
                  <input type="text" value={motos} onChange={e => setMotos(e.target.value)} placeholder="Ex: Especializada em Honda (Ou deixe em branco)"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
                </div>
              )}

              <button disabled={loading} type="submit"
                className={`w-full mt-4 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-md ${modoEdicao ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                {loading ? 'Salvando...' : modoEdicao ? <><Save size={16}/> Atualizar Cliente</> : 'Cadastrar Cliente'}
              </button>
            </form>
          </div>
        </div>

        {/* COLUNA DIREITA: TABELA DE CLIENTES */}
        <div className="xl:col-span-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
              <h2 className="text-lg font-bold">Base de Contatos</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input type="text" placeholder="Buscar nome ou moto..." value={busca} onChange={e => setBusca(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm w-64" />
              </div>
            </div>

            <div className="overflow-x-auto flex-1 p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-800/30 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="p-4 font-semibold">Cliente / Oficina</th>
                    <th className="p-4 font-semibold">Contato</th>
                    <th className="p-4 font-semibold">Veículos / Detalhes</th>
                    <th className="p-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => {
                    const isOficinaTag = cliente.motos?.includes('Oficina');
                    
                    return (
                      <tr key={cliente.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isOficinaTag ? 'bg-emerald-900/50 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {isOficinaTag ? <Briefcase size={14}/> : <User size={14}/>}
                            </div>
                            <span className="font-bold text-zinc-100">{cliente.nome}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-zinc-300">{cliente.whatsapp}</p>
                          {cliente.telefone && <p className="text-xs text-zinc-500">{cliente.telefone}</p>}
                        </td>
                        <td className="p-4">
                          {isOficinaTag ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {cliente.motos}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">{cliente.motos || 'Não informado'}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* BOTÃO DE EDITAR ADICIONADO AQUI */}
                            <button onClick={() => carregarParaEdicao(cliente)} title="Editar" className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 rounded transition-colors">
                              <Edit2 size={16} />
                            </button>
                            
                            <button onClick={() => excluirCliente(cliente.id)} title="Excluir" className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {clientesFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500 italic">
                        Nenhum cliente ou oficina cadastrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
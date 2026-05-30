'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, Users, Phone, MessageCircle, Bike } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    motos: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Erro ao buscar clientes", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modoEdicao && idEdicao) {
        const res = await fetch(`/api/clientes/${idEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Erro na API.");
      } else {
        const res = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Erro na API.");
      }
      resetarFormulario();
      fetchClientes();
    } catch (error) {
      alert("Ocorreu um erro ao salvar o cliente.");
      console.error(error);
    }
    setLoading(false);
  };

  const editarCliente = (cliente: any) => {
    setModoEdicao(true);
    setIdEdicao(cliente.id);
    setFormData({
      nome: cliente.nome || '',
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      motos: cliente.motos || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirCliente = async (id: string) => {
    if (confirm('Atenção: Tem certeza que deseja excluir este cliente? Históricos de orçamento poderão ser afetados.')) {
      try {
        const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        if (!res.ok) return alert(`Erro ao excluir.`);
        fetchClientes();
        if (id === idEdicao) resetarFormulario();
      } catch (error) {
        alert("Falha de rede ao tentar excluir.");
      }
    }
  };

  const resetarFormulario = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setFormData({ nome: '', telefone: '', whatsapp: '', motos: '' });
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (c.motos && c.motos.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      {/* Cabeçalho */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Users className="text-emerald-500" size={32} />
            Módulo de Clientes
          </h1>
          <p className="text-zinc-400 mt-1">Gestão de contatos e motos da sua base.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: Formulário */}
        <div className="xl:col-span-4 h-fit">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                {modoEdicao ? <Pencil size={18} className="text-blue-400" /> : <Plus size={18} className="text-emerald-500" />}
                {modoEdicao ? 'Editando Cliente' : 'Novo Cliente'}
              </h2>
              {modoEdicao && (
                <button type="button" onClick={resetarFormulario} className="text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-2 py-1 rounded">
                  Cancelar
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Nome Completo</label>
                  <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: João Silva"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">WhatsApp</label>
                    <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="(11) 9..."
                      className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Tel. Fixo/Extra</label>
                    <input type="text" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} placeholder="(11) 3..."
                      className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Modelo das Motos</label>
                  <input type="text" value={formData.motos} onChange={e => setFormData({...formData, motos: e.target.value})} placeholder="Ex: Fazer 250 (2018), CG Titan 160"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20">
                {loading ? 'Processando...' : (modoEdicao ? 'Atualizar Cliente' : 'Cadastrar Cliente')}
              </button>
            </form>
          </div>
        </div>

        {/* COLUNA DIREITA: Lista de Clientes */}
        <div className="xl:col-span-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input type="text" placeholder="Buscar por nome ou moto..." value={busca} onChange={e => setBusca(e.target.value)}
              className="w-full pl-11 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group relative">
                
                {/* Botões de Ação */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editarCliente(cliente)} title="Editar" className="p-2 bg-zinc-800 text-blue-400 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => excluirCliente(cliente.id)} title="Excluir" className="p-2 bg-zinc-800 text-red-400 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-zinc-100 mb-4 pr-16">{cliente.nome}</h3>
                
                <div className="space-y-3">
                  {cliente.whatsapp && (
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-8 h-8 rounded bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                        <MessageCircle size={16} />
                      </div>
                      <span>{cliente.whatsapp}</span>
                    </div>
                  )}

                  {cliente.telefone && (
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Phone size={16} />
                      </div>
                      <span>{cliente.telefone}</span>
                    </div>
                  )}

                  {cliente.motos && (
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Bike size={16} />
                      </div>
                      <span className="truncate">{cliente.motos}</span>
                    </div>
                  )}
                  
                  {!cliente.whatsapp && !cliente.telefone && !cliente.motos && (
                    <p className="text-xs text-zinc-600 italic">Nenhuma informação adicional cadastrada.</p>
                  )}
                </div>
              </div>
            ))}

            {clientesFiltrados.length === 0 && (
              <div className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
                <Users className="mx-auto text-zinc-600 mb-4" size={48} />
                <p className="text-zinc-400 font-medium">Nenhum cliente encontrado.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
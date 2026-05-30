'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, Package, AlertTriangle } from 'lucide-react';

const OPCOES_CATEGORIA = [
  "LED SMD", "Motor de Passo", "Display LCD", "Película Polarizada", 
  "Componente Eletrônico (Capacitor/Resistor)", "Ponteiro", "Outros"
];

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '', codigo: '', categoria: OPCOES_CATEGORIA[0], 
    quantidade: 0, precoCusto: 0, precoVenda: 0
  });

  useEffect(() => { fetchEstoque(); }, []);

  const fetchEstoque = async () => {
    try {
      const res = await fetch('/api/estoque');
      setProdutos(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modoEdicao && idEdicao) {
        await fetch(`/api/estoque/${idEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/estoque', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      resetarFormulario();
      fetchEstoque();
    } catch (error) { alert("Erro ao salvar o produto."); }
    setLoading(false);
  };

  const editarProduto = (prod: any) => {
    setModoEdicao(true);
    setIdEdicao(prod.id);
    setFormData({
      nome: prod.nome, codigo: prod.codigo || '', categoria: prod.categoria,
      quantidade: prod.quantidade, precoCusto: prod.precoCusto, precoVenda: prod.precoVenda
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirProduto = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta peça?')) {
      await fetch(`/api/estoque/${id}`, { method: 'DELETE' });
      fetchEstoque();
      if (id === idEdicao) resetarFormulario();
    }
  };

  const resetarFormulario = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setFormData({ nome: '', codigo: '', categoria: OPCOES_CATEGORIA[0], quantidade: 0, precoCusto: 0, precoVenda: 0 });
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (p.codigo && p.codigo.toLowerCase().includes(busca.toLowerCase()))
  );

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-zinc-100">
      
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="text-emerald-500" size={32} /> Almoxarifado Técnico
          </h1>
          <p className="text-zinc-400 mt-1">Controle seu estoque de LEDs, Motores, Displays e peças.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Formulário */}
        <div className="xl:col-span-4 h-fit">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {modoEdicao ? <Pencil size={18} className="text-blue-400" /> : <Plus size={18} className="text-emerald-500" />}
                {modoEdicao ? 'Editando Peça' : 'Nova Peça'}
              </h2>
              {modoEdicao && (
                <button type="button" onClick={resetarFormulario} className="text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 px-2 py-1 rounded">Cancelar</button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Nome/Descrição</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: LED SMD 3528 Azul"
                  className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Código (Opcional)</label>
                  <input type="text" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} placeholder="Ex: LD-01"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Quantidade</label>
                  <input required type="number" value={formData.quantidade} onChange={e => setFormData({...formData, quantidade: Number(e.target.value)})}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Categoria</label>
                <select required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                  className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500">
                  {OPCOES_CATEGORIA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Custo (R$)</label>
                  <input type="number" step="0.01" value={formData.precoCusto} onChange={e => setFormData({...formData, precoCusto: Number(e.target.value)})}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-red-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Venda (R$)</label>
                  <input type="number" step="0.01" value={formData.precoVenda} onChange={e => setFormData({...formData, precoVenda: Number(e.target.value)})}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-emerald-400 font-bold" />
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg mt-4 disabled:opacity-50">
                {loading ? 'Processando...' : (modoEdicao ? 'Atualizar Peça' : 'Cadastrar Peça')}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Estoque */}
        <div className="xl:col-span-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-500" />
            <input type="text" placeholder="Buscar peça ou código..." value={busca} onChange={e => setBusca(e.target.value)}
              className="w-full pl-12 p-4 bg-zinc-900 border border-zinc-800 rounded-xl outline-none focus:border-emerald-500" />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-800/50 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                  <th className="p-4 font-semibold">Peça / Categoria</th>
                  <th className="p-4 font-semibold text-center">Qtd.</th>
                  <th className="p-4 font-semibold text-right">Valores</th>
                  <th className="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((prod) => (
                  <tr key={prod.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-zinc-100">{prod.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {prod.codigo && <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Cód: {prod.codigo}</span>}
                        <span className="text-[10px] text-zinc-500 uppercase">{prod.categoria}</span>
                      </div>
                    </td>
                    
                    <td className="p-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${prod.quantidade <= 5 ? 'bg-red-900/30 text-red-400 border-red-900/50' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30'}`}>
                        {prod.quantidade <= 5 && <AlertTriangle size={14} />}
                        {prod.quantidade} un.
                      </div>
                    </td>
                    
                    <td className="p-4 text-right text-sm">
                      <p className="text-zinc-500 line-through decoration-zinc-600 text-xs">{formatarMoeda(prod.precoCusto)}</p>
                      <p className="text-emerald-400 font-bold">{formatarMoeda(prod.precoVenda)}</p>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => editarProduto(prod)} className="p-2 text-blue-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => excluirProduto(prod.id)} className="p-2 text-red-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produtosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 font-medium">Nenhuma peça no estoque.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
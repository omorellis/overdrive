'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, CircuitBoard } from 'lucide-react';

const OPCOES_MARCA = [
  "Yamaha", "Honda", "Suzuki", "Kawasaki", "Dafra", "BMW", "Triumph", "KTM", "Outra"
];

const OPCOES_FUNCAO = [
  "Não identificado", "VCC +12 (Bateria)", "VCC Pós-Chave", "GND (Terra)",
  "Pisca Lado Direito", "Pisca Lado Esquerdo", "Farol Alto", "Neutro",
  "Marcha 1", "Marcha 2", "Marcha 3", "Marcha 4", "Marcha 5", "Marcha 6",
  "Sinal RPM (Conta-giros)", "Sinal Velocidade (Sensor)", "Bomba/Boia de Combustível",
  "Luz de Injeção (FI)", "Luz de Óleo", "Luz de ABS", "Luz de Temperatura", "Iluminação do Painel"
];

// Mágica das Cores Técnicas
const getPinoCor = (funcao: string) => {
  if (funcao === 'Não identificado') 
    return 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:bg-zinc-800';
  
  if (funcao.includes('VCC')) 
    return 'bg-red-900/30 border-red-500/70 text-red-400 hover:bg-red-900/50 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]';
  
  if (funcao.includes('GND')) 
    return 'bg-black border-zinc-500 text-zinc-300 hover:bg-zinc-900 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]';
  
  if (funcao.includes('Pisca') || funcao.includes('Óleo') || funcao.includes('Temperatura') || funcao.includes('Iluminação')) 
    return 'bg-amber-900/30 border-amber-500/70 text-amber-400 hover:bg-amber-900/50 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]';
  
  if (funcao.includes('Farol Alto') || funcao.includes('Neutro')) 
    return 'bg-blue-900/30 border-blue-500/70 text-blue-400 hover:bg-blue-900/50 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]';
  
  if (funcao.includes('Marcha')) 
    return 'bg-purple-900/30 border-purple-500/70 text-purple-400 hover:bg-purple-900/50 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]';
  
  // Sinais, Sensores, ABS, FI (Verde)
  return 'bg-emerald-900/30 border-emerald-500/70 text-emerald-400 hover:bg-emerald-900/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]';
};

export default function PinagensPage() {
  const [pinagens, setPinagens] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const [marca, setMarca] = useState(OPCOES_MARCA[0]);
  const [moto, setMoto] = useState('');
  const [anoInicio, setAnoInicio] = useState('');
  const [anoFim, setAnoFim] = useState('');
  const [qtdPinos, setQtdPinos] = useState(16);
  const [listaPinos, setListaPinos] = useState<{ pino: number; funcao: string }[]>([]);

  useEffect(() => {
    if (listaPinos.length === 0) gerarPinos(16);
    fetchPinagens();
  }, []);

  const fetchPinagens = async () => {
    try {
      const res = await fetch('/api/pinagens');
      const data = await res.json();
      setPinagens(data);
    } catch (err) {
      console.error("Erro ao buscar pinagens", err);
    }
  };

  const handleQtdPinosChange = (novaQtd: number) => {
    setQtdPinos(novaQtd);
    if (!modoEdicao) gerarPinos(novaQtd);
  };

  const gerarPinos = (qtd: number) => {
    const novos = Array.from({ length: qtd }, (_, i) => ({
      pino: i + 1,
      funcao: 'Não identificado'
    }));
    setListaPinos(novos);
  };

  const handlePinoChange = (index: number, valor: string) => {
    const atualizados = [...listaPinos];
    atualizados[index].funcao = valor;
    setListaPinos(atualizados);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { marca, moto, anoInicio, anoFim, pinos: listaPinos };

    try {
      if (modoEdicao && idEdicao) {
        const res = await fetch(`/api/pinagens/${idEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro na API ao atualizar.");
      } else {
        const res = await fetch('/api/pinagens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro na API ao criar.");
      }
      resetarFormulario();
      fetchPinagens();
    } catch (error) {
      alert("Ocorreu um erro ao salvar.");
      console.error(error);
    }
    setLoading(false);
  };

  const editarPinagem = (pina: any) => {
    setModoEdicao(true);
    setIdEdicao(pina.id);
    setMarca(pina.marca);
    setMoto(pina.moto);
    setAnoInicio(pina.anoInicio.toString());
    setAnoFim(pina.anoFim.toString());
    setQtdPinos(pina.pinos.length);
    setListaPinos(JSON.parse(JSON.stringify(pina.pinos)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirPinagem = async (id: string) => {
    if (confirm('Atenção: Tem certeza que deseja excluir esta pinagem permanentemente?')) {
      try {
        const res = await fetch(`/api/pinagens/${id}`, { method: 'DELETE' });
        if (!res.ok) return alert(`Erro ao excluir.`);
        fetchPinagens();
        if (id === idEdicao) resetarFormulario();
      } catch (error) {
        alert("Falha de rede ao tentar excluir.");
      }
    }
  };

  const resetarFormulario = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setMarca(OPCOES_MARCA[0]);
    setMoto('');
    setAnoInicio('');
    setAnoFim('');
    setQtdPinos(16);
    gerarPinos(16);
  };

  const pinagensFiltradas = pinagens.filter(p => 
    p.moto.toLowerCase().includes(busca.toLowerCase()) || 
    p.marca.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <CircuitBoard className="text-emerald-500" size={32} />
            Módulo de Bancada
          </h1>
          <p className="text-zinc-400 mt-1">Gestão técnica de conectores e esquemas elétricos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* FORMULÁRIO */}
        <div className="xl:col-span-4 h-fit">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                {modoEdicao ? <Pencil size={18} className="text-blue-400" /> : <Plus size={18} className="text-emerald-500" />}
                {modoEdicao ? 'Editando Esquema' : 'Novo Esquema'}
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
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Fabricante</label>
                  <select required value={marca} onChange={e => setMarca(e.target.value)}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all">
                    {OPCOES_MARCA.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Modelo da Moto</label>
                  <input required type="text" value={moto} onChange={e => setMoto(e.target.value)} placeholder="Ex: Fazer 250"
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Ano Início</label>
                    <input required type="number" value={anoInicio} onChange={e => setAnoInicio(e.target.value)}
                      className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Ano Fim</label>
                    <input required type="number" value={anoFim} onChange={e => setAnoFim(e.target.value)}
                      className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Total de Pinos</label>
                  <input type="number" value={qtdPinos} onChange={e => handleQtdPinosChange(Math.max(2, Number(e.target.value)))}
                    disabled={modoEdicao}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-all" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Mapeamento dos Pinos</label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {listaPinos.map((pinoObj, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded text-xs font-bold border transition-colors ${getPinoCor(pinoObj.funcao)}`}>
                        {pinoObj.pino}
                      </div>
                      <select value={pinoObj.funcao} onChange={e => handlePinoChange(idx, e.target.value)}
                        className="flex-1 p-1.5 text-sm border-none bg-transparent text-zinc-200 outline-none cursor-pointer">
                        {OPCOES_FUNCAO.map(opcao => <option key={opcao} value={opcao} className="bg-zinc-900">{opcao}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20">
                {loading ? 'Processando...' : (modoEdicao ? 'Atualizar Esquema' : 'Salvar no Banco')}
              </button>
            </form>
          </div>
        </div>

        {/* VISUALIZAÇÃO */}
        <div className="xl:col-span-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input type="text" placeholder="Pesquisar por modelo ou fabricante..." value={busca} onChange={e => setBusca(e.target.value)}
              className="w-full pl-11 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {pinagensFiltradas.map((pina) => (
              <div key={pina.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm group">
                <div className="bg-zinc-800/30 p-5 border-b border-zinc-800 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold bg-zinc-800 px-2.5 py-1 rounded-md text-zinc-300 uppercase tracking-wide border border-zinc-700">
                      {pina.marca}
                    </span>
                    <h3 className="text-2xl font-bold text-zinc-100 mt-3">{pina.moto}</h3>
                    <p className="text-sm text-zinc-400 mt-1">Compatibilidade: {pina.anoInicio} – {pina.anoFim}</p>
                  </div>

                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => editarPinagem(pina)} title="Editar" className="p-2.5 bg-zinc-800 text-blue-400 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => excluirPinagem(pina.id)} title="Excluir" className="p-2.5 bg-zinc-800 text-red-400 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-zinc-950/30 flex flex-col items-center overflow-x-auto">
                  <p className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-[0.2em]">Conector Frontal (Olhando o Painel)</p>
                  
                  <div className="w-20 h-4 bg-zinc-600 rounded-t-lg border-t-2 border-l-2 border-r-2 border-zinc-500"></div>
                  
                  <div className="bg-zinc-800 p-4 rounded-b-xl rounded-tr-xl rounded-tl-xl border-2 border-zinc-600 shadow-inner">
                    <div 
                      className="grid gap-2.5" 
                      style={{ gridTemplateColumns: `repeat(${Math.ceil(pina.pinos.length / 2)}, minmax(0, 1fr))` }}
                    >
                      {pina.pinos.map((p: any) => (
                        <div 
                          key={p.pino} 
                          title={p.funcao}
                          className={`w-14 h-14 flex flex-col items-center justify-center border-2 rounded-lg font-bold cursor-help transition-all shadow-sm ${getPinoCor(p.funcao)}`}
                        >
                          <span className="text-lg">{p.pino}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-4">*Esquerda para a direita (Pino 1 no canto superior esquerdo).</p>
                </div>
              </div>
            ))}

            {pinagensFiltradas.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
                <CircuitBoard className="mx-auto text-zinc-600 mb-4" size={48} />
                <p className="text-zinc-400 font-medium">Nenhum esquema elétrico encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
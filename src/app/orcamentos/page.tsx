'use client';

import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Plus, Trash2, Printer, FileText, Save, X } from 'lucide-react';

export default function OrcamentosPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [orcamentosSalvos, setOrcamentosSalvos] = useState<any[]>([]);
  const [oficinaConfig, setOficinaConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const [clienteId, setClienteId] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('ORÇAMENTO');
  const [veiculoManual, setVeiculoManual] = useState(''); // NOVO: Campo livre para a moto na nota
  const [itens, setItens] = useState([{ descricao: '', preco: 0 }]);

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClientes();
    fetchOrcamentos();
    fetchOficinaConfig();
  }, []);

  const fetchClientes = async () => {
    const res = await fetch('/api/clientes');
    setClientes(await res.json());
  };

  const fetchOrcamentos = async () => {
    const res = await fetch('/api/orcamentos');
    setOrcamentosSalvos(await res.json());
  };

  const fetchOficinaConfig = async () => {
    const res = await fetch('/api/configuracao');
    setOficinaConfig(await res.json());
  };

  const adicionarItem = () => setItens([...itens, { descricao: '', preco: 0 }]);
  const removerItem = (index: number) => setItens(itens.filter((_, i) => i !== index));
  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    setItens(novosItens);
  };

  const valorTotal = itens.reduce((acc, item) => acc + (Number(item.preco) || 0), 0);
  
  // Detalhe importante: se tiver veículo preenchido na nota, usa ele. Senão, puxa o padrão do cliente.
  const clienteSelecionado = clientes.find(c => c.id === clienteId);
  const veiculoExibicao = veiculoManual || clienteSelecionado?.motos || '---';

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${tipoDocumento}_OverDrive_${clienteSelecionado?.nome || 'Cliente'}`,
  });

  const salvarEGerarPDF = async () => {
    if (!clienteId) return alert("Selecione um cliente primeiro!");
    if (valorTotal <= 0) return alert("Adicione itens com valor válido!");

    setLoading(true);
    try {
      // Adicionamos o veículo manual nas observações do payload para o banco
      const payload = { 
        clienteId, 
        tipo: tipoDocumento, 
        total: valorTotal, 
        itens,
        observacoes: veiculoManual // Usando o campo observações existente para guardar a moto
      };

      if (modoEdicao && idEdicao) {
        await fetch(`/api/orcamentos/${idEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/orcamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      fetchOrcamentos();
      if (handlePrint) handlePrint();
      
    } catch (error) {
      alert("Erro ao salvar o documento.");
    }
    setLoading(false);
  };

  const carregarParaImpressao = (orc: any) => {
    setModoEdicao(true);
    setIdEdicao(orc.id);
    setClienteId(orc.clienteId);
    setTipoDocumento(orc.tipo);
    setVeiculoManual(orc.observacoes || '');
    try {
      setItens(JSON.parse(orc.itens));
    } catch (e) {
      console.error("Erro ao ler os itens.");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setClienteId('');
    setVeiculoManual('');
    setTipoDocumento('ORÇAMENTO');
    setItens([{ descricao: '', preco: 0 }]);
  };

  const excluirOrcamento = async (id: string) => {
    if (confirm('Deletar este registro permanentemente?')) {
      await fetch(`/api/orcamentos/${id}`, { method: 'DELETE' });
      fetchOrcamentos();
      if (id === idEdicao) cancelarEdicao();
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const numeroDoc = idEdicao ? idEdicao.substring(0, 6).toUpperCase() : Date.now().toString().substring(7);

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans text-zinc-100">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="text-emerald-500" size={32} /> Orçamentos e Notas
        </h1>
        <p className="text-zinc-400 mt-1">Gere PDFs com controle total sobre as motos e serviços.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* FORMULÁRIO */}
        <div className="xl:col-span-5 h-fit space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl relative">
            {modoEdicao && (
              <div className="absolute top-0 left-0 w-full bg-blue-900/30 border-b border-blue-900/50 p-2 flex justify-between items-center rounded-t-xl">
                <span className="text-xs font-bold text-blue-400 uppercase ml-4">Editando Documento #{numeroDoc}</span>
                <button onClick={cancelarEdicao} className="text-zinc-400 hover:text-white mr-2"><X size={16}/></button>
              </div>
            )}

            <h2 className={`text-lg font-semibold mb-5 flex items-center gap-2 ${modoEdicao ? 'mt-8' : ''}`}>
              Configurar Documento
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Tipo</label>
                  <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500">
                    <option value="ORÇAMENTO">Orçamento</option>
                    <option value="NOTA DE SERVIÇO">Nota de Serviço (Garantia)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Cliente / Oficina</label>
                  <select value={clienteId} onChange={e => setClienteId(e.target.value)}
                    className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500">
                    <option value="">Selecione...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>

              {/* NOVO: Campo para especificar a moto da nota corrente */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Moto / Veículo desta Nota</label>
                <input 
                  type="text" 
                  value={veiculoManual} 
                  onChange={e => setVeiculoManual(e.target.value)} 
                  placeholder="Ex: Titan 160 Vermelha - Placa XYZ-999"
                  className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 outline-none focus:border-emerald-500 text-sm" 
                />
                <p className="text-[10px] text-zinc-500 mt-1">Essencial para oficinas parceiras que mandam várias motos diferentes.</p>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-3">Serviços e Peças</label>
                <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {itens.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                      <input type="text" placeholder="Descrição (Ex: Reparo de Display)" value={item.descricao} 
                        onChange={e => atualizarItem(idx, 'descricao', e.target.value)}
                        className="flex-1 p-2 border-none bg-transparent outline-none text-zinc-200 text-sm" />
                      <div className="flex items-center gap-1 border-l border-zinc-700 pl-2">
                        <span className="text-zinc-500 font-bold text-sm">R$</span>
                        <input type="number" placeholder="0,00" value={item.preco || ''} 
                          onChange={e => atualizarItem(idx, 'preco', Number(e.target.value))}
                          className="w-20 p-2 border-none bg-transparent outline-none text-emerald-400 font-bold text-sm" />
                      </div>
                      <button onClick={() => removerItem(idx)} disabled={itens.length === 1} className="p-2 text-red-500 hover:bg-zinc-800 rounded disabled:opacity-30">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={adicionarItem} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                  <Plus size={16} /> Adicionar Linha
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-950 p-4 rounded-lg">
                <span className="text-zinc-400 font-semibold uppercase tracking-widest text-xs">Total Calculado</span>
                <span className="text-2xl font-black text-emerald-400">{formatarMoeda(valorTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
                <button disabled={!clienteId} onClick={() => handlePrint && handlePrint()} type="button"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Printer size={18} /> Imprimir Atual
                </button>
                <button disabled={loading || !clienteId} onClick={salvarEGerarPDF} type="button"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {loading ? 'Gerando...' : 'Salvar e Gerar'}
                </button>
              </div>
            </div>
          </div>

          {/* HISTÓRICO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Histórico Recente</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {orcamentosSalvos.slice(0, 10).map(orc => (
                <div key={orc.id} className="flex justify-between items-center p-3 bg-zinc-950 rounded-lg border border-zinc-800 group">
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${orc.tipo === 'ORÇAMENTO' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'} uppercase mr-2`}>
                      {orc.tipo}
                    </span>
                    <p className="text-sm font-medium mt-1">{orc.cliente?.nome}</p>
                    {orc.observacoes && <p className="text-[11px] text-zinc-500 mt-0.5 italic">{orc.observacoes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-300 mr-2">{formatarMoeda(orc.total)}</span>
                    <button onClick={() => carregarParaImpressao(orc)} className="p-2 text-blue-400 bg-zinc-800 hover:bg-blue-600 hover:text-white rounded-lg">
                      <FileText size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PREVIEW DO PDF */}
        <div className="xl:col-span-7 bg-zinc-800/30 p-8 rounded-xl border border-zinc-800 flex justify-center overflow-x-auto">
          <div 
            ref={componentRef} 
            className="bg-white text-zinc-900 w-[210mm] min-h-[297mm] p-12 shadow-2xl relative"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-zinc-800">
              <div>
                <img src="/logo-clara.png" alt="OverDrive Custom Logo" className="h-20 max-w-[280px] object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black uppercase tracking-widest text-zinc-500">{tipoDocumento}</h2>
                <p className="text-zinc-600 font-bold tracking-wider mt-1">#{numeroDoc}</p>
                <p className="text-zinc-500 text-xs mt-1">Data: {dataHoje}</p>
              </div>
            </div>

            <div className="flex gap-6 mb-10">
              <div className="flex-1 bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3 border-b border-zinc-200 pb-2">Faturado Para</p>
                <p className="font-bold text-zinc-900 text-lg uppercase">{clienteSelecionado?.nome || 'NÃO IDENTIFICADO'}</p>
                <p className="text-sm text-zinc-600 mt-1">Contato: {clienteSelecionado?.whatsapp || '---'}</p>
                
                {/* DINÂMICO: Se você digitou a moto no campo livre, ela sai aqui de forma impecável */}
                <p className="text-sm text-zinc-600">Veículo: <span className="font-bold text-zinc-900 uppercase">{veiculoExibicao}</span></p>
              </div>
              
              <div className="w-1/3 bg-zinc-900 p-5 rounded-lg text-zinc-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1">Contato Oficina</p>
                <p className="text-sm font-semibold">{oficinaConfig?.telefone || '(24) 99999-9999'}</p>
                <p className="text-sm text-zinc-300 font-medium">{oficinaConfig?.instagram || '@overdrive.custom'}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  {oficinaConfig?.endereco || 'Rua da Oficina, 123'}<br />
                  {oficinaConfig?.cidadeEstado || 'Três Rios - RJ'}
                </p>
              </div>
            </div>

            <div className="mb-10 min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-white">
                    <th className="py-3 px-5 font-bold uppercase text-xs tracking-wider rounded-tl-lg w-[80%]">Descrição do Serviço / Peça</th>
                    <th className="py-3 px-5 font-bold uppercase text-xs tracking-wider text-right rounded-tr-lg">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, idx) => (
                    item.descricao ? (
                      <tr key={idx} className="border-b border-zinc-200 hover:bg-zinc-50">
                        <td className="py-4 px-5 text-sm font-medium text-zinc-700">{item.descricao}</td>
                        <td className="py-4 px-5 text-sm text-right font-bold text-zinc-900">{formatarMoeda(item.preco)}</td>
                      </tr>
                    ) : null
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-start justify-between mt-8">
              <div className="w-3/5 pr-8">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Termos e Condições</p>
                <div className="text-xs text-zinc-600 bg-zinc-50 p-4 rounded border border-zinc-200">
                  {tipoDocumento === 'ORÇAMENTO' ? (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Orçamento válido por <span className="font-bold text-zinc-900">15 dias corridos</span>.</li>
                      <li>Valores sujeitos a alteração após o vencimento do prazo.</li>
                      <li>Início do serviço condicionado à aprovação expressa do cliente.</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Garantia legal de <span className="font-bold text-zinc-900">90 dias corridos</span>, conforme o Código de Defesa do Consumidor.</li>
                      <li>A garantia cobre exclusivamente os serviços e peças listadas acima.</li>
                      <li>Violação de lacres, quedas ou instalação elétrica inadequada da moto anulam a garantia.</li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="w-2/5">
                <div className="bg-zinc-100 border-2 border-zinc-400 rounded-xl p-5 text-center">
                  <p className="text-xs font-black uppercase text-zinc-600 tracking-widest mb-1">
                    {tipoDocumento === 'ORÇAMENTO' ? 'Total a Pagar' : 'Valor Total Pago'}
                  </p>
                  <p className="text-4xl font-black text-zinc-900">{formatarMoeda(valorTotal)}</p>
                </div>
              </div>
            </div>

            {tipoDocumento.includes('NOTA') && (
              <div className="absolute bottom-28 left-0 right-0 flex justify-center">
                <div className="text-center w-72">
                  <div className="border-t-2 border-zinc-400 mb-2"></div>
                  <p className="text-xs font-bold text-zinc-800 uppercase tracking-widest">Assinatura do Técnico</p>
                  <p className="text-[10px] text-zinc-500 mt-1">OverDrive Custom Oficial</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-zinc-900 flex items-center justify-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Tecnologia e Especialidade em Painéis Digitais</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
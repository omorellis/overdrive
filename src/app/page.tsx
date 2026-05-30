'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Wrench, CheckCircle2, AlertTriangle, Users, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      setDados(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  if (loading) {
    return <div className="p-8 text-zinc-400 flex items-center gap-2"><Activity className="animate-spin" /> Carregando painel de controle...</div>;
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans text-zinc-100">
      
      {/* CABEÇALHO DO DASHBOARD COM SUA LOGO OFICIAL */}
      <header className="mb-10 flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-1">Painel de Comando</p>
          <h1 className="text-4xl font-bold text-zinc-100">Visão Geral</h1>
        </div>
        
        {/* Renderiza a sua imagem oficial da logo no canto superior direito */}
        <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 flex items-center h-16 max-w-[240px]">
          <img 
            src="/logo.png" 
            alt="OverDrive Custom Logo" 
            className="h-full w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </header>

      {/* CARDS MÈTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-500"><DollarSign size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Vol. Orçamentos</h3>
          </div>
          <p className="text-4xl font-black text-zinc-100">{formatarMoeda(dados?.faturamentoTotal)}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
            <Wrench size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-900/30 p-2 rounded-lg text-blue-500"><Wrench size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Painéis em Bancada</h3>
          </div>
          <p className="text-4xl font-black text-zinc-100">{dados?.osAtivas} <span className="text-sm font-medium text-zinc-500 lowercase">painéis</span></p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
            <CheckCircle2 size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-900/30 p-2 rounded-lg text-purple-500"><CheckCircle2 size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Serviços Entregues</h3>
          </div>
          <p className="text-4xl font-black text-zinc-100">{dados?.osEntregues} <span className="text-sm font-medium text-zinc-500 lowercase">concluídos</span></p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-red-500/10 group-hover:text-red-500/20 transition-colors">
            <AlertTriangle size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-900/30 p-2 rounded-lg text-red-500"><AlertTriangle size={20} /></div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Alertas de Estoque</h3>
          </div>
          <p className="text-4xl font-black text-zinc-100">{dados?.estoqueBaixo} <span className="text-sm font-medium text-zinc-500 lowercase">itens críticos</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Painéis Recentes (Movimentações)</h2>
            <Link href="/ordens" className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-medium">
              Ver Kanban <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-800/30 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="p-4 font-semibold">Cliente / Painel</th>
                  <th className="p-4 font-semibold text-center">Status Atual</th>
                  <th className="p-4 font-semibold text-right">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {dados?.ultimasOS.map((os: any) => (
                  <tr key={os.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-zinc-100">{os.equipamento}</p>
                      <p className="text-xs text-zinc-500">{os.cliente?.nome}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase
                        ${os.status === 'AGUARDANDO' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                        ${os.status === 'BANCADA' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : ''}
                        ${os.status === 'PEÇA' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                        ${os.status === 'FINALIZADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                        ${os.status === 'ENTREGUE' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                      `}>
                        {os.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-zinc-400">
                      {new Date(os.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Users className="text-emerald-500"/> Base OverDrive</h2>
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-zinc-400">Total de Clientes</span>
                <span className="text-2xl font-black">{dados?.clientesTotal}</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-sm text-zinc-400">
                <p>Mantenha sua base atualizada para acompanhar o histórico de retorno dos clientes.</p>
              </div>
            </div>
          </div>
          <Link href="/clientes" className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            Gerenciar Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}
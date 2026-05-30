'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Lock } from 'lucide-react';

export default function ConfigPage() {
  const [loading, setLoading] = useState(false);
  
  // Estados dos Dados da Oficina
  const [nomeOficina, setNomeOficina] = useState('');
  const [telefone, setTelefone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');

  // Estados de Segurança
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const res = await fetch('/api/configuracao');
    const data = await res.json();
    setNomeOficina(data.nomeOficina);
    setTelefone(data.telefone);
    setInstagram(data.instagram);
    setEndereco(data.endereco);
    setCidadeEstado(data.cidadeEstado);
  };

  const salvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/configuracao', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeOficina, telefone, instagram, endereco, cidadeEstado })
    });
    alert('Dados da oficina atualizados com sucesso!');
    setLoading(false);
  };

  const alterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaSenha) return;
    await fetch('/api/auth/senha', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novaSenha })
    });
    alert('Senha de acesso alterada com sucesso!');
    setNovaSenha('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-zinc-100">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="text-emerald-500" size={32} /> Painel do Sistema
        </h1>
        <p className="text-zinc-400 mt-1">Gerencie as informações da oficina e parâmetros de segurança.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Formulário de Dados de Contato */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-200">
            Dados da Oficina (Impressão)
          </h2>
          <form onSubmit={salvarConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Nome da Oficina</label>
              <input required type="text" value={nomeOficina} onChange={e => setNomeOficina(e.target.value)}
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Telefone / WhatsApp</label>
              <input required type="text" value={telefone} onChange={e => setTelefone(e.target.value)}
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Instagram</label>
              <input required type="text" value={instagram} onChange={e => setInstagram(e.target.value)}
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Endereço (Linha 1)</label>
              <input required type="text" value={endereco} onChange={e => setEndereco(e.target.value)}
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Cidade - Estado</label>
              <input required type="text" value={cidadeEstado} onChange={e => setCidadeEstado(e.target.value)}
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
              <Save size={16} /> Salvar Dados
            </button>
          </form>
        </div>

        {/* Formulário de Troca de Senha */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-200">
            Segurança da Conta
          </h2>
          <form onSubmit={alterarSenha} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">Nova Senha de Acesso</label>
              <input required type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Digite a nova senha"
                className="w-full p-2.5 border border-zinc-700 rounded-lg bg-zinc-950 outline-none focus:border-emerald-500 text-sm" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
              <Lock size={16} /> Alterar Senha Master
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Wrench, Users, FileText, Cpu, Package, Layers, Activity, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [erro, setErro] = useState("");

// Checa o login e altera o título da aba do navegador dinamicamente
  useEffect(() => {
    const session = localStorage.getItem("overdrive_session");
    if (session) setLogado(true);
  }, []);

  useEffect(() => {
    document.title = logado ? "OverDrive OS | Gestão" : "OverDrive OS | Acesso Restrito";
  }, [logado]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: username, senha: senhaInput })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("overdrive_session", data.login);
      setLogado(true);
      setSenhaInput("");
    } else {
      setErro(data.error || "Erro ao tentar logar.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("overdrive_session");
    setLogado(false);
  };

  // =========================================================
  // TELA DE LOGIN PREMIUM (BLINDADA E COM SUA LOGO)
  // =========================================================
  if (!logado) {
    return (
      <html lang="pt-BR" className="dark">
        <body className={`${inter.className} bg-zinc-950 text-zinc-100 flex items-center justify-center h-screen relative overflow-hidden`}>
          
          {/* Brilho de fundo (Efeito Premium) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-md p-10 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-center relative z-10">
            
            {/* Logo da OverDrive Custom */}
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="OverDrive Custom Logo" 
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <h1 className="text-xl font-black uppercase tracking-widest text-zinc-100">Acesso Restrito</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Gestão de Oficina</p>

            <form onSubmit={handleLogin} className="mt-8 text-left space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 tracking-wider">Usuário</label>
                <input 
                  required 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Ex: admin"
                  className="w-full p-3.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 tracking-wider">Senha</label>
                <input 
                  required 
                  type="password" 
                  value={senhaInput} 
                  onChange={e => setSenhaInput(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full p-3.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium tracking-widest" 
                />
              </div>

              {erro && (
                <p className="text-xs text-red-400 font-semibold bg-red-950/30 p-3 rounded-lg border border-red-900/40 text-center">
                  {erro}
                </p>
              )}

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-colors text-sm shadow-lg shadow-emerald-900/20 mt-2 uppercase tracking-wider">
                Entrar no Sistema
              </button>
            </form>
          </div>
        </body>
      </html>
    );
  }

  // =========================================================
  // RENDERIZA O SISTEMA COMPLETO APÓS O LOGIN
  // =========================================================
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 flex h-screen overflow-hidden`}>
        
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex">
          <div className="h-16 flex items-center justify-center px-6 border-b border-zinc-800 bg-zinc-900">
            <img 
              src="/logo.png" 
              alt="OverDrive Custom Logo" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Visão Geral</p>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Activity size={18} /><span className="text-sm font-medium">Dashboard</span>
            </Link>

            <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-6">Módulos</p>
            <Link href="/clientes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Users size={18} /><span className="text-sm font-medium">Clientes</span>
            </Link>
            <Link href="/pinagens" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Cpu size={18} /><span className="text-sm font-medium">Bancada (Pinagens)</span>
            </Link>
            <Link href="/estoque" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Package size={18} /><span className="text-sm font-medium">Estoque (Peças)</span>
            </Link>
            <Link href="/ordens" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Layers size={18} /><span className="text-sm font-medium">Produção (O.S.)</span>
            </Link>
            <Link href="/orcamentos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <FileText size={18} /><span className="text-sm font-medium">Orçamentos & Notas</span>
            </Link>

            <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-6">Sistema</p>
            <Link href="/configuracao" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              <Settings size={18} /><span className="text-sm font-medium">Configurações</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-600/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-200">Administrador</span>
                <span className="text-[10px] text-emerald-500 font-medium">Conta Master</span>
              </div>
            </div>
            <button onClick={handleLogout} title="Sair do Sistema" className="text-zinc-500 hover:text-red-400 p-2 rounded-lg bg-zinc-950 border border-zinc-800 transition-colors shadow-sm">
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto bg-zinc-950 relative">
          {children}
        </main>

      </body>
    </html>
  );
}
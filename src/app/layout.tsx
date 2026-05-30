'use client';

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Users, FileText, Cpu, Package, Layers, Activity, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [montado, setMontado] = useState(false); // Estado novo para evitar erro de Hydration
  const [logado, setLogado] = useState<boolean>(() => typeof window !== 'undefined' && Boolean(localStorage.getItem("overdrive_session")));
  const [username, setUsername] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [erro, setErro] = useState("");
  
  const [menuAberto, setMenuAberto] = useState(false);

  // Lê o localStorage apenas após a tela montar no cliente
  useEffect(() => {
    setTimeout(() => setMontado(true), 0);
  }, []);

  useEffect(() => {
    if (montado) {
      document.title = logado ? "OverDrive OS | Gestão" : "OverDrive OS | Acesso Restrito";
    }
  }, [logado, montado]);

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

  const fecharMenu = () => setMenuAberto(false);

  return (
    // suppressHydrationWarning impede que extensões (ColorZilla, AdBlock) quebrem o Next.js
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 flex h-screen overflow-hidden`} suppressHydrationWarning>
        
        {/* PREVENT HYDRATION MISMATCH: Mostra nada até o React carregar as variáveis locais */}
        {!montado ? (
          <div className="flex-1 flex items-center justify-center w-full h-full bg-zinc-950"></div>
        ) : !logado ? (
          
          /* =========================================================
             TELA DE LOGIN
             ========================================================= */
          <div className="flex-1 flex items-center justify-center w-full h-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="w-full max-w-md p-10 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-center relative z-10 mx-4">
              <div className="flex justify-center mb-6">
                <img src="/logo.png" alt="OverDrive Custom Logo" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <h1 className="text-xl font-black uppercase tracking-widest text-zinc-100">Acesso Restrito</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Gestão de Oficina</p>
              <form onSubmit={handleLogin} className="mt-8 text-left space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 tracking-wider">Usuário</label>
                  <input required type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Ex: admin"
                    className="w-full p-3.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 tracking-wider">Senha</label>
                  <input required type="password" value={senhaInput} onChange={e => setSenhaInput(e.target.value)} placeholder="••••••••"
                    className="w-full p-3.5 border border-zinc-700 rounded-lg bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium tracking-widest" />
                </div>
                {erro && <p className="text-xs text-red-400 font-semibold bg-red-950/30 p-3 rounded-lg border border-red-900/40 text-center">{erro}</p>}
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-colors text-sm shadow-lg shadow-emerald-900/20 mt-2 uppercase tracking-wider">
                  Entrar no Sistema
                </button>
              </form>
            </div>
          </div>

        ) : (

          /* =========================================================
             SISTEMA LOGADO E COMPLETO
             ========================================================= */
          <>
            {/* OVERLAY MOBILE */}
            {menuAberto && (
              <div 
                className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" 
                onClick={fecharMenu}
              />
            )}
            
            {/* SIDEBAR (Desktop e Mobile) */}
            <aside className={`
              fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col 
              transform transition-transform duration-300 ease-in-out
              ${menuAberto ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0
            `}>
              <div className="h-16 flex items-center justify-between md:justify-center px-6 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
                <img src="/logo.png" alt="OverDrive Custom Logo" className="h-8 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                
                {/* Botão de Fechar apenas no Mobile */}
                <button onClick={fecharMenu} className="md:hidden text-zinc-500 hover:text-white p-1 rounded-lg bg-zinc-950 border border-zinc-800">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Visão Geral</p>
                <Link href="/" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Activity size={18} /><span className="text-sm font-medium">Dashboard</span>
                </Link>

                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-6">Módulos</p>
                <Link href="/clientes" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Users size={18} /><span className="text-sm font-medium">Clientes</span>
                </Link>
                <Link href="/pinagens" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Cpu size={18} /><span className="text-sm font-medium">Bancada (Pinagens)</span>
                </Link>
                <Link href="/estoque" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Package size={18} /><span className="text-sm font-medium">Estoque (Peças)</span>
                </Link>
                <Link href="/ordens" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Layers size={18} /><span className="text-sm font-medium">Produção (O.S.)</span>
                </Link>
                <Link href="/orcamentos" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <FileText size={18} /><span className="text-sm font-medium">Orçamentos & Notas</span>
            </Link>

                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-6">Sistema</p>
                <Link href="/configuracao" onClick={fecharMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
                  <Settings size={18} /><span className="text-sm font-medium">Configurações</span>
                </Link>
              </nav>
              
              <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50 flex-shrink-0">
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

            {/* ÁREA PRINCIPAL (Header Mobile + Conteúdo) */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              
              <header className="md:hidden h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0 z-30 shadow-md">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMenuAberto(true)} className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    <Menu size={22} />
                  </button>
                </div>
                <img src="/logo.png" alt="Logo Mobile" className="h-6 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                <div className="w-8"></div>
              </header>

              <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 pb-8 md:p-0 md:pb-0 relative">
                {children}
              </main>
            </div>
          </>
        )}
      </body>
    </html>
  );
}
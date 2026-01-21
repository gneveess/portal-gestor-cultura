import { useState } from 'react'

const ProfessorDashboard = ({ onLogout }) => {
  // Estado para controlar qual aba do menu está ativa
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans relative">
      
      {/* --- CONTEÚDO PRINCIPAL (Com padding bottom para não esconder atrás do menu) --- */}
      <main className="p-6 pb-28 animate-fade-in">
        
        {/* 1. Cabeçalho com Perfil */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {/* Avatar Simulado */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-transparent">
                <span className="text-lg">👨‍🏫</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Olá, Professor!</h2>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online agora
              </p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </header>

        {/* 2. Card de Destaque (Resumo do Dia) */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20 relative overflow-hidden">
          {/* Efeito de fundo decorativo */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          
          <h3 className="text-blue-100 text-sm font-medium mb-1">Visão Geral</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">3</span>
            <span className="text-blue-200 mb-1">Aulas hoje</span>
          </div>
          <p className="text-blue-200/80 text-xs mt-2">Próxima aula em 45 minutos.</p>
        </div>

        {/* 3. Ações Rápidas (Botões Modernos) */}
        <h3 className="text-white font-bold text-lg mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl transition-all duration-300 flex flex-col items-start gap-3 relative overflow-hidden">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/></svg>
            </div>
            <span className="font-semibold text-slate-200">Nova Chamada</span>
          </button>

          <button className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl transition-all duration-300 flex flex-col items-start gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
            </div>
            <span className="font-semibold text-slate-200">Relatórios</span>
          </button>
        </div>

        {/* 4. Lista de Turmas */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg">Suas Turmas</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300">Ver todas</button>
        </div>

        <div className="space-y-3">
          {/* Card Turma 1 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-900/20">
                🎭
              </div>
              <div>
                <h4 className="text-white font-semibold">Teatro Iniciante</h4>
                <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                  🕒 Ter/Qui - 14:00
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold">25</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Alunos</span>
            </div>
          </div>

          {/* Card Turma 2 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20">
                💃
              </div>
              <div>
                <h4 className="text-white font-semibold">Expressão Corporal</h4>
                <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                  🕒 Sex - 09:00
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold">18</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Alunos</span>
            </div>
          </div>
        </div>

      </main>

      {/* --- MENU INFERIOR FLUTUANTE (DOCK) --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex justify-around items-center z-50">
        
        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
          label="Início" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
        />

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
          label="Aulas" 
          active={activeTab === 'classes'} 
          onClick={() => setActiveTab('classes')}
        />

        {/* Botão Central de Ação (Scanner QR Code, por exemplo) */}
        <div className="-mt-8">
          <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/40 transition-transform hover:scale-105 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
          </button>
        </div>

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>}
          label="Agenda" 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')}
        />

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
          label="Perfil" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        />

      </nav>

    </div>
  )
}

// Componente Auxiliar para os Botões do Menu
const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
      active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium transition-opacity ${active ? 'opacity-100' : 'opacity-0 hidden'}`}>
      {label}
    </span>
    {active && <div className="w-1 h-1 rounded-full bg-blue-400 mt-1"></div>}
  </button>
)

export default ProfessorDashboard
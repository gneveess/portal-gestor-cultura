const ProfessorDashboard = ({ onLogout }) => {
  return (
    <div className="w-full max-w-md animate-fade-in pb-20">
      
      {/* Cabeçalho do Professor */}
      <header className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white">Olá, Professor! 👋</h2>
          <p className="text-slate-400 text-xs">Aulas de Hoje: 3</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs transition"
        >
          Sair
        </button>
      </header>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg active:scale-95 transition flex flex-col items-center gap-2">
          <span className="text-2xl">📝</span>
          Nova Chamada
        </button>
        <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl font-bold shadow active:scale-95 transition flex flex-col items-center gap-2">
          <span className="text-2xl">📊</span>
          Relatórios
        </button>
      </div>

      {/* Lista de Turmas (Simulação) */}
      <section>
        <h3 className="text-slate-400 text-sm font-bold uppercase mb-3 tracking-wider">Suas Turmas</h3>
        <div className="flex flex-col gap-3">
          
          {/* Card Turma 1 */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center hover:border-blue-500 transition cursor-pointer">
            <div>
              <h4 className="text-white font-semibold">Teatro Iniciante</h4>
              <p className="text-slate-500 text-xs">Ter/Qui - 14:00</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs font-bold">
              25
            </div>
          </div>

          {/* Card Turma 2 */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center hover:border-blue-500 transition cursor-pointer">
            <div>
              <h4 className="text-white font-semibold">Expressão Corporal</h4>
              <p className="text-slate-500 text-xs">Sex - 09:00</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs font-bold">
              18
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default ProfessorDashboard
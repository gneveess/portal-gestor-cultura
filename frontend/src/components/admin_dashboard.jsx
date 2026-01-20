import { useState } from 'react'

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      
      {/* Cabeçalho do Painel */}
      <header className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border-l-4 border-purple-500">
        <div>
          <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
          <p className="text-slate-400 text-sm">Gerencie usuários e turmas</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-red-400 hover:text-red-300 text-sm font-semibold border border-red-900/30 px-4 py-2 rounded hover:bg-red-900/20 transition"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Coluna 1: Formulário de Cadastro (O antigo RegisterCard veio pra cá) */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-green-500">+</span> Novo Usuário
          </h3>
          
          <form className="flex flex-col gap-3">
            <input type="text" placeholder="Nome Completo" className="bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none focus:border-purple-500" />
            <input type="email" placeholder="E-mail Corporativo" className="bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none focus:border-purple-500" />
            <input type="password" placeholder="Senha Temporária" className="bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none focus:border-purple-500" />
            
            <div className="flex gap-2 mt-2">
              <select className="bg-slate-900 text-white p-3 rounded border border-slate-600 flex-1 outline-none">
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition">
              Cadastrar Usuário
            </button>
          </form>
        </section>

        {/* Coluna 2: Lista de Usuários (Placeholder visual) */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 opacity-70">
          <h3 className="text-xl font-semibold text-white mb-4">Últimos Cadastros</h3>
          <ul className="space-y-3">
            <li className="flex justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <span className="text-slate-300">Prof. Girafales</span>
              <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">Ativo</span>
            </li>
            <li className="flex justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <span className="text-slate-300">Dona Florinda</span>
              <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">Ativo</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard
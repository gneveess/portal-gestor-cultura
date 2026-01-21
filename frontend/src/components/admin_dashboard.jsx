import { useState, useEffect } from 'react'
import { request } from '../api'

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]) 
  const [loading, setLoading] = useState(true)
  
  // Estado para controlar a navegação (Abas)
  const [activeTab, setActiveTab] = useState('home') // 'home' (Lista), 'create' (Formulário), 'settings' (Config)

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'professor'
  })
  const [registering, setRegistering] = useState(false)

  // Busca Usuários
  const fetchUsers = async () => {
    try {
      const data = await request('/auth/users', 'GET')
      setUsers(data)
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar Usuário
  const handleRegister = async (e) => {
    e.preventDefault()
    setRegistering(true)

    try {
      await request('/auth/create_user', 'POST', formData)
      alert(`Usuário ${formData.name} criado com sucesso!`)
      setFormData({ name: '', email: '', password: '', type: 'professor' })
      fetchUsers()
      setActiveTab('home') // Volta para a lista automaticamente após criar
    } catch (error) {
      alert("Erro: " + error.message)
    } finally {
      setRegistering(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans relative">
      
      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="p-6 pb-28 animate-fade-in max-w-2xl mx-auto">
        
        {/* 1. Cabeçalho Admin */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-transparent">
                <span className="text-lg">🛡️</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Painel Admin</h2>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Sistema Ativo
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

        {/* --- VIEW: HOME (LISTA DE USUÁRIOS) --- */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            
            {/* Stats Card */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-white/10 blur-3xl"></div>
              <h3 className="text-purple-200 text-sm font-medium mb-1">Total de Usuários</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{users.length}</span>
                <span className="text-purple-300 mb-1 text-sm">cadastrados</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">Membros da Equipe</h3>
              <button onClick={fetchUsers} className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              </button>
            </div>

            {/* Lista Scrollável */}
            <div className="space-y-3 pb-4">
              {loading ? (
                <p className="text-center text-slate-500 py-10">Carregando...</p>
              ) : users.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                  <p className="text-slate-400">Nenhum usuário encontrado.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 hover:border-purple-500/30 transition group">
                    <div className="flex gap-4 items-center">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                        user.tipo === 'admin' 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-900/20' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.nome}</h4>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          📧 {user.email}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${
                       user.tipo === 'admin' 
                       ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                       : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.tipo}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- VIEW: CREATE (FORMULÁRIO) --- */}
        {activeTab === 'create' && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Novo Cadastro</h3>
            
            <form onSubmit={handleRegister} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 backdrop-blur-sm">
              
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Nome Completo</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">👤</span>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Silva"
                    className="w-full bg-slate-950 text-white pl-11 p-3 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">✉️</span>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="nome@sistema.com"
                    className="w-full bg-slate-950 text-white pl-11 p-3 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Senha Inicial</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">🔒</span>
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white pl-11 p-3 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Nível de Acesso</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'professor'})}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      formData.type === 'professor' 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xl">🎓</span>
                    <span className="text-sm font-bold">Professor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'admin'})}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      formData.type === 'admin' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xl">🛡️</span>
                    <span className="text-sm font-bold">Admin</span>
                  </button>
                </div>
              </div>

              <button 
                disabled={registering}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                {registering ? 'Salvando...' : (
                  <>
                    <span>Confirmar Cadastro</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </main>

      {/* --- MENU INFERIOR FLUTUANTE (DOCK) --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex justify-around items-center z-50">
        
        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>}
          label="Dashboard" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
        />

        {/* Botão Central de Ação (Adicionar) */}
        <div className="-mt-8">
          <button 
            onClick={() => setActiveTab('create')}
            className={`p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 border-4 border-slate-950 ${
              activeTab === 'create' 
              ? 'bg-purple-500 text-white shadow-purple-600/40 rotate-90' 
              : 'bg-white text-slate-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </button>
        </div>

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>}
          label="Ajustes" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        />

      </nav>

    </div>
  )
}

// Botão Auxiliar do Menu
const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${
      active ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium transition-opacity ${active ? 'opacity-100' : 'opacity-0 hidden'}`}>
      {label}
    </span>
    {active && <div className="w-1 h-1 rounded-full bg-purple-400 mt-1"></div>}
  </button>
)

export default AdminDashboard
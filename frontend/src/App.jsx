import { useState } from 'react'
import LoginCard from './components/login_card.jsx'
import AdminLoginCard from './components/admin_login_card.jsx'
import ForgotPasswordCard from './components/forgot_password_card.jsx'
import AdminDashboard from './components/admin_dashboard.jsx'
import ProfessorDashboard from './components/professor_dashboard.jsx' // <--- Import Novo

function App() {
  // Estados possíveis: 'login', 'admin_login', 'admin_dashboard', 'professor_dashboard', 'forgot'
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* Título (só aparece nas telas de Login/Recuperação) */}
      {['login', 'admin_login', 'forgot'].includes(view) && (
        <>
          <h1 className="text-4xl font-bold text-blue-500 mb-2 text-center">
            Portal Gestor 🎭
          </h1>
          <p className="text-slate-400 mb-8 text-center">
            Gestão Cultural Simplificada
          </p>
        </>
      )}
      
      {/* --- TELAS DE LOGIN --- */}

      {view === 'login' && (
        <LoginCard 
          onForgot={() => setView('forgot')}
          onLoginSuccess={() => setView('professor_dashboard')} // <--- Redireciona Professor
        />
      )}

      {view === 'admin_login' && (
        <AdminLoginCard 
          onBack={() => setView('login')}
          onLoginSuccess={() => setView('admin_dashboard')} // <--- Redireciona Admin
        />
      )}

      {view === 'forgot' && (
        <ForgotPasswordCard onBack={() => setView('login')} />
      )}

      {/* --- PAINÉIS (DASHBOARDS) --- */}

      {view === 'professor_dashboard' && (
        <ProfessorDashboard onLogout={() => setView('login')} />
      )}

      {view === 'admin_dashboard' && (
        <AdminDashboard onLogout={() => setView('login')} />
      )}
      
      {/* --- RODAPÉ --- */}
      {view === 'login' && (
        <footer className="mt-12 flex flex-col items-center gap-2 text-sm">
          <p className="text-slate-500">Desenvolvido com Mobile First 📱</p>
          <button 
            onClick={() => setView('admin_login')}
            className="text-slate-600 hover:text-purple-400 transition-colors text-xs underline decoration-slate-700 underline-offset-4 cursor-pointer"
          >
            Acesso Restrito (Admin)
          </button>
        </footer>
      )}

    </div>
  )
}

export default App
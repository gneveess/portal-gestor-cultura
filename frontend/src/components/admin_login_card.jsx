import { useState } from 'react';
import { request } from '../api'; 

const AdminLoginCard = ({ onBack, onLoginSuccess }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    console.log("Tentando logar com:", email); // Debug no Console
    setLoading(true);

    try {
      // 1. Faz o pedido pro Python
      const data = await request('/auth/login', 'POST', { 
        email: email, 
        password: password 
      });

      console.log("Resposta do Python:", data); // Debug no Console

      // 2. AQUI É O PULO DO GATO: Se o Python não devolver 'admin', a gente barra.
      if (data.usuario.tipo !== 'admin') {
        alert("⛔ PERMISSÃO NEGADA: Este login não é de administrador.");
        setLoading(false);
        return; // Sai da função e NÃO deixa entrar
      }

      // 3. Só chega aqui se for Admin e a senha estiver certa
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      onLoginSuccess(data.usuario); 

    } catch (error) {
      console.error("Erro no login:", error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-purple-900">
      <div className="flex flex-col items-center mb-6">
        <span className="text-4xl mb-2">🛡️</span>
        <h2 className="text-2xl font-semibold text-white text-center">Acesso Administrativo</h2>
        <p className="text-purple-400 text-xs uppercase tracking-widest mt-1 font-bold">Área Restrita</p>
      </div>
      
      {/* O SEGREDO ESTÁ AQUI: onSubmit chama a função handleAdminLogin */}
      <form className="flex flex-col gap-4" onSubmit={handleAdminLogin}>
        <div>
          <label className="block text-slate-300 mb-1 text-sm">Usuário Admin</label>
          <input 
            type="email" 
            placeholder="**********" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-slate-300 mb-1 text-sm">Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-bold py-3 rounded transition-all active:scale-95 flex justify-center"
        >
          {loading ? 'Verificando...' : 'Entrar como Administrador'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          type="button" // Importante ser type="button" para não submeter o form
          onClick={onBack}
          className="text-slate-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 w-full"
        >
          ← Voltar para Login de Professor
        </button>
      </div>
    </section>
  )
}

export default AdminLoginCard
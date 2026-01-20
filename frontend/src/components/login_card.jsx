import { useState } from 'react';
import { request } from '../api'; // <--- Importamos nossa função mágica

const LoginCard = ({ onForgot, onLoginSuccess }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar que está carregando

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Envia os dados para o Backend
      const data = await request('/auth/login', 'POST', { 
        email: email, 
        password: password 
      });

      // 2. Se chegou aqui, o login deu certo!
      // Vamos salvar os dados do usuário no navegador (LocalStorage) para usar depois
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      alert(`Bem-vindo, ${data.usuario.nome}!`);
      
      // 3. Avisa o App para mudar a tela
      onLoginSuccess(data.usuario);

    } catch (error) {
      // 4. Se der erro (senha errada, etc)
      alert('Erro no Login: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Login do Professor
      </h2>
      
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-slate-300 mb-1 text-sm">E-mail</label>
          <input 
            type="email" 
            required 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-slate-300 mb-1 text-sm">Senha</label>
          <input 
            type="password" 
            required 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
            className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors" 
          />
          
          <div className="flex justify-end mt-2">
            <button 
              type="button" 
              onClick={onForgot}
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 rounded transition-all active:scale-95 flex justify-center"
        >
          {loading ? 'Carregando...' : 'Entrar no Sistema'}
        </button>
      </form>
    </section>
  )
}

export default LoginCard
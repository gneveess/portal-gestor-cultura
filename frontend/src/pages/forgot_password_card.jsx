const ForgotPasswordCard = ({ onBack }) => {
  return (
    <section className="w-full max-w-sm bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-yellow-600/50">
      
      <div className="text-center mb-6">
        <span className="text-4xl">🔐</span>
        <h2 className="text-2xl font-semibold text-white mt-2">
          Recuperar Senha
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Digite seu e-mail para receber um link de redefinição.
        </p>
      </div>
      
      <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault()
          alert("Simulação: E-mail de recuperação enviado!")
      }}>
        <div>
          <label className="block text-slate-300 mb-1 text-sm">E-mail cadastrado</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            className="w-full p-3 rounded bg-slate-900 text-white border border-slate-600 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded transition-all active:scale-95"
        >
          Enviar Link
        </button>
      </form>

      {/* Botão para Voltar */}
      <div className="mt-6 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 w-full"
        >
          ← Voltar para o Login
        </button>
      </div>
    </section>
  )
}

export default ForgotPasswordCard
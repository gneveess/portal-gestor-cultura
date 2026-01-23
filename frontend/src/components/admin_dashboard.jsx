import { useState, useEffect } from 'react'
import { request } from '../api'

const AdminDashboard = ({ onLogout }) => {
  // --- ESTADOS GERAIS ---
  const [activeTab, setActiveTab] = useState('home') // 'home', 'create_user', 'create_student', 'classes', 'reports'
  const [loading, setLoading] = useState(true)
  
  // Dados do Banco
  const [users, setUsers] = useState([])
  const [turmas, setTurmas] = useState([])

  // --- ESTADOS DOS FORMULÁRIOS ---
  
  // 1. Form de Usuário (Admin/Prof)
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', type: 'professor' })
  const [registeringUser, setRegisteringUser] = useState(false)

  // 2. Form de Aluno (Com seleção de turmas)
  const [studentForm, setStudentForm] = useState({
    nome_completo: '',
    data_nascimento: '',
    nome_responsavel: '',
    telefone: '',
    turmas_ids: [] // Array para guardar os IDs das turmas selecionadas
  })
  const [registeringStudent, setRegisteringStudent] = useState(false)

  // 3. Form de Nova Turma (O que faltava)
  const [classForm, setClassForm] = useState({
    nome: '',
    horario: ''
  })
  const [registeringClass, setRegisteringClass] = useState(false)
  
  const [selectedClass, setSelectedClass] = useState(null)
  // --- FUNÇÕES DE API (BACKEND) ---

  // Busca Usuários e Turmas ao carregar
  const fetchData = async () => {
    setLoading(true)
    try {
      // Tenta buscar usuários
      const usersData = await request('/auth/users', 'GET')
      setUsers(usersData)

      // Tenta buscar turmas (se a rota existir, senão usa array vazio)
      try {
        const turmasData = await request('/turmas', 'GET')
        setTurmas(turmasData)
      } catch (e) {
        console.warn("Rota de turmas ainda não criada ou vazia.")
        setTurmas([]) 
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }
  // Função chamada ao clicar no card da turma
  const handleClassClick = async (id) => {
    setLoading(true)
    try {
      // Chama a rota nova que criamos acima
      const data = await request(`/turmas/${id}`, 'GET')
      setSelectedClass(data)
      setActiveTab('class_details') // Muda para a tela de detalhes
    } catch (error) {
      alert("Erro ao abrir turma: " + error.message)
    } finally {
      setLoading(false)
    }
  }





  // Excluir Usuário
  const handleDeleteUser = async (id, nome) => {
    if (confirm(`Tem certeza que deseja remover ${nome} do sistema?`)) {
      try {
        await request(`/auth/users/${id}`, 'DELETE')
        fetchData() // Recarrega a lista
        alert("Usuário removido.")
      } catch (error) {
        alert("Erro ao excluir: " + error.message)
      }
    }
  }

  // Salvar NOVO USUÁRIO (Admin/Prof)
  const handleRegisterUser = async (e) => {
    e.preventDefault()
    setRegisteringUser(true)
    try {
      await request('/auth/create_user', 'POST', userForm)
      alert(`Usuário ${userForm.name} criado com sucesso!`)
      setUserForm({ name: '', email: '', password: '', type: 'professor' })
      fetchData()
      setActiveTab('home')
    } catch (error) {
      alert("Erro: " + error.message)
    } finally {
      setRegisteringUser(false)
    }
  }

  // Salvar NOVO ALUNO (Com vínculo de turmas)
  const handleRegisterStudent = async (e) => {
    e.preventDefault()
    setRegisteringStudent(true)
    try {
      await request('/alunos', 'POST', studentForm)
      alert("Aluno matriculado com sucesso!")
      setStudentForm({ nome_completo: '', data_nascimento: '', nome_responsavel: '', telefone: '', turmas_ids: [] })
      setActiveTab('home') // Volta pro início
    } catch (error) {
      alert("Erro ao matricular: " + error.message)
    } finally {
      setRegisteringStudent(false)
    }
  }

  // Função auxiliar para selecionar/deselecionar turma no cadastro de aluno
  const toggleTurmaSelection = (id) => {
    setStudentForm(prev => {
      const isSelected = prev.turmas_ids.includes(id)
      if (isSelected) {
        return { ...prev, turmas_ids: prev.turmas_ids.filter(tid => tid !== id) }
      } else {
        return { ...prev, turmas_ids: [...prev.turmas_ids, id] }
      }
    })
  }
   
  // Função para Cadastrar Turma
  const handleRegisterClass = async (e) => {
    e.preventDefault()
    setRegisteringClass(true)
    try {
      await request('/turmas', 'POST', classForm)
      alert(`Turma "${classForm.nome}" criada!`)
      
      // Limpa formulário
      setClassForm({ nome: '', horario: '' })
      
      // Atualiza a lista de turmas na hora (para aparecer nos selects)
      fetchData() // Reusa sua função que busca tudo
      setActiveTab('classes') // Leva o usuário para a aba de turmas
    } catch (error) {
      alert("Erro ao criar turma: " + error.message)
    } finally {
      setRegisteringClass(false)
    }
  }
  
  
  // Carrega dados na montagem
  useEffect(() => {
    fetchData()
  }, [])


  // --- RENDERIZAÇÃO ---

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans relative">
      
      {/* CONTEÚDO PRINCIPAL */}
      <main className="p-6 pb-28 animate-fade-in max-w-2xl mx-auto">
        
        {/* Cabeçalho */}
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
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Sistema Ativo
              </p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </header>


        {/* --- VIEW: HOME (DASHBOARD GERAL) --- */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-6">
            
            {/* Atalho Grande: Cadastrar Aluno */}
            <button 
              onClick={() => setActiveTab('create_student')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-3xl shadow-lg shadow-blue-900/20 flex items-center justify-between group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl text-white text-2xl">🎓</div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">Matricular Aluno</h3>
                  <p className="text-blue-100 text-xs">Cadastrar e vincular turmas</p>
                </div>
              </div>
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>

            {/* Card de Estatísticas */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs uppercase font-bold">Equipe</span>
                  <div className="text-3xl font-bold text-white mt-1">{users.length}</div>
               </div>
               <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs uppercase font-bold">Turmas</span>
                  <div className="text-3xl font-bold text-white mt-1">{turmas.length}</div>
               </div>
            </div>

            {/* Lista de Usuários do Sistema */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">Usuários do Sistema</h3>
                <button onClick={fetchData} className="text-xs text-purple-400 hover:text-purple-300">Atualizar</button>
              </div>
              
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-purple-500/30 transition group">
                    <div className="flex gap-4 items-center">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        user.tipo === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.nome}</h4>
                        <span className="text-[10px] uppercase tracking-wide text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {user.tipo}
                        </span>
                      </div>
                    </div>
                    {/* Botão de Excluir (Lixeira) */}
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.nome)}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* --- VIEW: TURMAS (LISTAGEM ATUALIZADA) --- */}
        {/* --- VIEW: TURMAS (LISTAGEM DE CARDS CLICÁVEIS) --- */}
        {activeTab === 'classes' && (
          <div className="animate-fade-in space-y-6">
            
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-white">Turmas Ativas</h3>
              <button 
                onClick={() => setActiveTab('create_class')}
                className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-lg shadow-pink-900/20 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Nova Turma
              </button>
            </div>
            
            <div className="grid gap-4">
              {turmas.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500">Nenhuma turma encontrada.</p>
                </div>
              ) : (
                turmas.map((t) => (
                  // --- AQUI ESTÁ A MÁGICA ---
                  // Adicionamos onClick na DIV principal e cursor-pointer
                  <div 
                    key={t.id} 
                    onClick={() => handleClassClick(t.id)} 
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10 transition duration-300 relative overflow-hidden group"
                  >
                      {/* Efeito de Canto Decorativo */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-bl-full group-hover:bg-pink-500/10 transition"></div>
                      
                      {/* Conteúdo do Card */}
                      <h4 className="text-lg font-bold text-white mb-1">{t.nome}</h4>
                      
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                         {t.horario}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 bg-pink-900/20 px-3 py-1 rounded-full w-fit">
                         👨‍🏫 {t.professor}
                      </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* --- VIEW: CREATE CLASS (NOVA TURMA) --- */}
        {activeTab === 'create_class' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setActiveTab('classes')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h3 className="text-xl font-bold">Nova Turma</h3>
            </div>

            <form onSubmit={handleRegisterClass} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 backdrop-blur-sm">
              
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Nome da Atividade</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">🎭</span>
                  <input 
                    type="text" 
                    required 
                    value={classForm.nome}
                    onChange={(e) => setClassForm({...classForm, nome: e.target.value})}
                    placeholder="Ex: Teatro Iniciante, Ballet..."
                    className="w-full bg-slate-950 text-white pl-11 p-3 rounded-xl border border-slate-800 focus:border-pink-500 outline-none transition" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Dias e Horários</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">🕒</span>
                  <input 
                    type="text" 
                    required 
                    value={classForm.horario}
                    onChange={(e) => setClassForm({...classForm, horario: e.target.value})}
                    placeholder="Ex: Seg/Qua as 19h"
                    className="w-full bg-slate-950 text-white pl-11 p-3 rounded-xl border border-slate-800 focus:border-pink-500 outline-none transition" 
                  />
                </div>
              </div>

              <button 
                disabled={registeringClass}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {registeringClass ? 'Criando...' : 'Criar Turma'}
              </button>
            </form>
          </div>
        )}
        {/* --- TELA DE DETALHES DA TURMA --- */}
        {activeTab === 'class_details' && selectedClass && (
          <div className="animate-fade-in">
            {/* Botão Voltar */}
            <button onClick={() => setActiveTab('classes')} className="mb-4 text-slate-400 hover:text-white flex items-center gap-2">
               ← Voltar para Turmas
            </button>

            <h2 className="text-2xl font-bold text-white mb-1">{selectedClass.nome}</h2>
            <p className="text-pink-400 text-sm mb-6">{selectedClass.horario} • Prof. {selectedClass.professor}</p>

            <h3 className="text-lg font-bold text-white mb-3">Alunos Matriculados ({selectedClass.alunos.length})</h3>

            <div className="space-y-2">
                {selectedClass.alunos.length === 0 ? (
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-500 text-center">
                        Nenhum aluno nesta turma.
                    </div>
                ) : (
                    selectedClass.alunos.map(aluno => (
                        <div key={aluno.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                            <span className="text-white font-medium">{aluno.nome}</span>
                            <span className="text-xs text-slate-500">{aluno.telefone}</span>
                        </div>
                    ))
                )}
            </div>
          </div>
        )}
        {/* --- VIEW: CREATE STUDENT (CADASTRO DE ALUNO) --- */}
        {activeTab === 'create_student' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setActiveTab('home')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h3 className="text-xl font-bold">Ficha do Aluno</h3>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-6">
              
              {/* Seção 1: Dados Pessoais */}
              <section className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4">
                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  Dados Pessoais
                </h4>
                
                <input 
                  required 
                  value={studentForm.nome_completo}
                  onChange={e => setStudentForm({...studentForm, nome_completo: e.target.value})}
                  placeholder="Nome Completo do Aluno" 
                  className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition" 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="date"
                    value={studentForm.data_nascimento}
                    onChange={e => setStudentForm({...studentForm, data_nascimento: e.target.value})}
                    className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none text-slate-300" 
                  />
                  <input 
                    type="tel" 
                    value={studentForm.telefone}
                    onChange={e => setStudentForm({...studentForm, telefone: e.target.value})}
                    placeholder="Telefone / Zap" 
                    className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition" 
                  />
                </div>

                <input 
                  value={studentForm.nome_responsavel}
                  onChange={e => setStudentForm({...studentForm, nome_responsavel: e.target.value})}
                  placeholder="Nome do Responsável (se menor)" 
                  className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition" 
                />
              </section>

              {/* Seção 2: Seleção de Turmas */}
              <section className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-pink-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-pink-500 rounded-full"></span>
                    Matricular em:
                  </h4>
                  <span className="text-xs text-slate-500">{studentForm.turmas_ids.length} selecionadas</span>
                </div>
                
                {turmas.length === 0 ? (
                   <p className="text-slate-500 text-sm italic">Cadastre turmas primeiro.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {turmas.map(turma => {
                      const isSelected = studentForm.turmas_ids.includes(turma.id)
                      return (
                        <div 
                          key={turma.id}
                          onClick={() => toggleTurmaSelection(turma.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center select-none ${
                            isSelected 
                              ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-900/20' 
                              : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <h5 className={`font-bold transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>{turma.nome}</h5>
                            <p className="text-xs text-slate-500">{turma.horario}</p>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <button 
                disabled={registeringStudent}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {registeringStudent ? 'Salvando...' : (
                  <>
                    <span>Confirmar Matrícula</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}


        {/* --- VIEW: CREATE USER (CADASTRO DE ADMIN/PROF) --- */}
        {activeTab === 'create_user' && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Novo Usuário</h3>
            <form onSubmit={handleRegisterUser} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 backdrop-blur-sm">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Nome</label>
                <input type="text" required value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-purple-500 outline-none" placeholder="Ex: Prof. Girafales" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Email</label>
                <input type="email" required value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-purple-500 outline-none" placeholder="email@escola.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Senha</label>
                <input type="password" required value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-purple-500 outline-none" placeholder="******" />
              </div>
              
              
              
              
              
              <div className="grid grid-cols-2 gap-3">
                 <button type="button" onClick={() => setUserForm({...userForm, type: 'professor'})} className={`p-3 rounded-xl border font-bold text-sm transition ${userForm.type === 'professor' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>Professor</button>
                 <button type="button" onClick={() => setUserForm({...userForm, type: 'admin'})} className={`p-3 rounded-xl border font-bold text-sm transition ${userForm.type === 'admin' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>Admin</button>
              </div>
              <button disabled={registeringUser} className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition">{registeringUser ? 'Salvando...' : 'Cadastrar Membro'}</button>
            </form>
          </div>
        )}

      </main>


      {/* --- MENU DOCK (NAVEGAÇÃO INFERIOR) --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex justify-between px-6 items-center z-50">
        
        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>}
          label="Início" 
          active={activeTab === 'home' || activeTab === 'create_student'} // Ativo se estiver na home ou criando aluno
          onClick={() => setActiveTab('home')}
        />

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
          label="Turmas" 
          active={activeTab === 'classes'} 
          onClick={() => setActiveTab('classes')}
        />

        {/* Botão Central (+) para ADICIONAR MEMBRO DA EQUIPE */}
        <div className="-mt-8">
          <button 
            onClick={() => setActiveTab('create_user')}
            className={`p-4 rounded-full shadow-lg transition-transform hover:scale-105 border-4 border-slate-950 ${
              activeTab === 'create_user' 
              ? 'bg-purple-500 text-white rotate-90 shadow-purple-500/50' 
              : 'bg-white text-slate-900 shadow-white/20'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </button>
        </div>

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>}
          label="Relatórios" 
          active={activeTab === 'reports'} 
          onClick={() => alert("Em breve!")}
        />

        <NavButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
          label="Ajustes" 
          active={activeTab === 'settings'} 
          onClick={() => alert("Em breve!")}
        />

      </nav>
    </div>
  )
}

// Botão Auxiliar do Menu
const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-14 ${
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
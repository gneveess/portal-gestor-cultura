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
  // --- ESTADOS ATUALIZADOS PARA DADOS REAIS ---
  const [searchTerm, setSearchTerm] = useState('')
  const [alunos, setAlunos] = useState([]) // Começa vazio
  const [loadingAlunos, setLoadingAlunos] = useState(false) // Para mostrar "Carregando..."

  // 1. BUSCAR DO BACKEND (Assim que abrir a aba 'students')
  useEffect(() => {
    if (activeTab === 'students') {
      fetchAlunos()
    }
  }, [activeTab])

  const fetchAlunos = async () => {
    setLoadingAlunos(true)
    try {
      const data = await request('/alunos', 'GET')
      setAlunos(data)
    } catch (error) {
      console.error("Erro ao buscar alunos:", error)
      alert("Não foi possível carregar a lista de alunos.")
    } finally {
      setLoadingAlunos(false)
    }
  }

  // Filtragem (agora nos dados reais)
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.matricula.includes(searchTerm)
  )

  // Funções de Ação
  const handleStudentClick = (aluno) => {
    console.log("Aluno clicado:", aluno)
    // Futuro: setActiveTab('student_details')
  }

  const handleEditStudent = (e, aluno) => {
    e.stopPropagation()
    console.log("Editar:", aluno)
  }
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
  // Estado para controlar qual configuração está aberta ('security', 'members' ou null)
  const [openSection, setOpenSection] = useState(null);

  // Função para abrir/fechar
  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null); // Fecha se clicar no mesmo
    } else {
      setOpenSection(section); // Abre o novo
    }
  };




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
    e.preventDefault(); // Impede a página de recarregar

    // Debug: Olha no console (F12) o que está indo. Tem que ter: name, email, password, type
    console.log("Enviando para o Python:", userForm);

    try {
      const data = await request('/auth/create_user', 'POST', userForm);

      if (data && data.id) {
        alert("Usuário criado com sucesso!");
        setUserForm({ name: '', email: '', password: '', type: 'professor' }); // Reseta
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message || "Erro desconhecido ao criar usuário.");
    }
  };

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

      {/* CONTEÚDO PRINCIPAL - ESTILO CORPORATIVO/SAAS */}
<main className="p-8 pb-28 animate-fade-in max-w-4xl mx-auto">

  {/* Cabeçalho Executivo */}
  <header className="flex justify-between items-end mb-12 border-b border-slate-800 pb-6">
    <div>
      <h2 className="text-3xl font-light text-white tracking-tight">Visão Geral</h2>
      <div className="flex items-center gap-3 mt-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wide">
          Online
        </span>
        <p className="text-slate-500 text-sm">Gestão Administrativa</p>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-white text-sm font-medium">Administrador</p>
        <p className="text-slate-500 text-xs">admin@sistema.com</p>
      </div>
      <button 
        onClick={onLogout} 
        className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        title="Sair do Sistema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
      </button>
    </div>
  </header>

  {/* --- VIEW: HOME (DASHBOARD) --- */}
  {activeTab === 'home' && (
    <div className="animate-fade-in space-y-10">

      {/* 1. KPIs (Indicadores de Performance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card KPI: Total de Membros */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Colaboradores</p>
            <h3 className="text-4xl font-light text-white">{users.length}</h3>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/></svg>
          </div>
        </div>

        {/* Card KPI: Total de Turmas */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Turmas Ativas</p>
            <h3 className="text-4xl font-light text-white">{turmas.length}</h3>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
        </div>

      </div>

      {/* 2. Tabela de Usuários (Estilo Enterprise) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        
        {/* Cabeçalho da Tabela (Barra de Ferramentas) */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-white font-medium text-lg">Membros da Equipe</h3>
          <button 
            onClick={fetchData} 
            className="text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-wider flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-800"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>
             Sync
          </button>
        </div>

        {/* Cabeçalho das Colunas */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-950/30 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          <div className="col-span-6">Colaborador</div>
          <div className="col-span-4">Cargo / Função</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {/* Linhas da Tabela */}
        <div className="divide-y divide-slate-800">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors group">
              
              {/* Coluna 1: Nome + Avatar */}
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-200 text-sm font-medium">{user.nome}</span>
              </div>

              {/* Coluna 2: Badge de Cargo */}
              <div className="col-span-4">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                  user.tipo === 'admin' 
                    ? 'bg-purple-500/5 text-purple-400 border-purple-500/20' 
                    : 'bg-blue-500/5 text-blue-400 border-blue-500/20'
                }`}>
                  {user.tipo}
                </span>
              </div>

              {/* Coluna 3: Ações */}
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleDeleteUser(user.id, user.nome)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                  title="Remover acesso"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

            </div>
          ))}

          {users.length === 0 && (
             <div className="px-6 py-8 text-center text-slate-500 text-sm">
                Nenhum registro encontrado no sistema.
             </div>
          )}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
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
                    onChange={(e) => setClassForm({ ...classForm, nome: e.target.value })}
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
                    onChange={(e) => setClassForm({ ...classForm, horario: e.target.value })}
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
        {/* --- VIEW: ALUNOS (COM DADOS REAIS) --- */}
        {activeTab === 'students' && (
          <div className="animate-fade-in space-y-6">

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Meus Alunos</h3>
                <p className="text-slate-400 text-sm">
                  {loadingAlunos ? 'Atualizando lista...' : `${alunos.length} alunos cadastrados.`}
                </p>
              </div>

              {/* Barra de Busca e Botão Novo */}
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative group w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="16.65" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
                  Novo
                </button>
              </div>
            </div>

            {/* Grid de Cards */}
            {loadingAlunos ? (
              // Skeleton Loading (Efeito de carregamento)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alunosFiltrados.length === 0 ? (
                  <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-3xl">
                    <p className="text-slate-500">Nenhum aluno encontrado.</p>
                  </div>
                ) : (
                  alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      onClick={() => handleStudentClick(aluno)}
                      className="group bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${aluno.status === 'ativo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>

                      <div className="flex items-center gap-4">
                        {/* Avatar Automático */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-300 group-hover:scale-105 transition-transform duration-300">
                          {aluno.nome.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">{aluno.nome}</h4>
                          <p className="text-xs text-slate-500 truncate">Mat: {aluno.matricula}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                            <span className="truncate">{aluno.turma}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleEditStudent(e, aluno)}
                        className="absolute bottom-4 right-4 p-2 bg-slate-800 text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {/* --- VIEW: SETTINGS (CONFIGURAÇÕES) --- */}
{activeTab === 'settings' && (
  <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
    
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-slate-800 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">Configurações</h3>
        <p className="text-slate-400 text-sm">Gerencie segurança e membros da equipe</p>
      </div>
    </div>

    {/* 1. ACORDEÃO DE SEGURANÇA */}
    <div className={`bg-slate-900 border ${openSection === 'security' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-slate-800'} rounded-2xl overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => toggleSection('security')}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </div>
          <div className="text-left">
            <h4 className="text-lg font-bold text-white">Segurança</h4>
            <p className="text-xs text-slate-500">Alterar senha e proteção</p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-500 transition-transform duration-300 ${openSection === 'security' ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {openSection === 'security' && (
        <div className="p-6 pt-0 animate-fade-in border-t border-slate-800/50 mt-2">
          <div className="space-y-4 max-w-lg mt-4">
             {/* Inputs de Senha (Mantidos iguais ao seu layout) */}
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Senha Atual</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 transition outline-none" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nova Senha</label>
                  <input type="password" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 transition outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Confirmar</label>
                  <input type="password" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-purple-500 transition outline-none" />
                </div>
             </div>
             <div className="pt-2">
                <button className="bg-slate-800 hover:bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors w-full md:w-auto shadow-lg">
                  Atualizar Senha
                </button>
             </div>
          </div>
        </div>
      )}
    </div>

    {/* 2. ACORDEÃO DE MEMBROS (CORRIGIDO) */}
    <div className={`bg-slate-900 border ${openSection === 'members' ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-800'} rounded-2xl overflow-hidden transition-all duration-300 relative`}>
      
      <button
        onClick={() => toggleSection('members')}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" x2="20" y1="8" y2="14" /><line x1="23" x2="17" y1="11" y2="11" /></svg>
          </div>
          <div className="text-left">
            <h4 className="text-lg font-bold text-white">Equipe</h4>
            <p className="text-xs text-slate-500">Cadastrar novos professores ou admins</p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-500 transition-transform duration-300 ${openSection === 'members' ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {openSection === 'members' && (
        <div className="p-6 pt-0 animate-fade-in border-t border-slate-800/50 mt-2 relative z-10">
          
          <form onSubmit={handleRegisterUser} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* CORREÇÃO 1: userForm.name em vez de userForm.nome */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 transition outline-none" 
                    required 
                    value={userForm.name || ''} 
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">E-mail Corporativo</label>
                <input 
                    type="email" 
                    placeholder="joao@escola.com" 
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 transition outline-none" 
                    required 
                    value={userForm.email || ''} 
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Senha de Acesso</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:border-blue-500 transition outline-none" 
                    required 
                    value={userForm.password || ''} 
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Cargo</label>
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={() => setUserForm({ ...userForm, type: 'professor' })} 
                        className={`flex-1 p-3 rounded-xl border font-bold text-sm transition ${userForm.type === 'professor' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                    >
                        Professor
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setUserForm({ ...userForm, type: 'admin' })} 
                        className={`flex-1 p-3 rounded-xl border font-bold text-sm transition ${userForm.type === 'admin' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                    >
                        Admin
                    </button>
                </div>
              </div>

              {/* CORREÇÃO 2: col-span-2 para ocupar a largura total em baixo */}
              <div className="md:col-span-2 pt-2">
                <button 
                    disabled={registeringUser} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-[0.99]"
                >
                    {registeringUser ? 'Salvando...' : 'Cadastrar Membro'}
                </button>
              </div>

            </div>
          </form>
        </div>
      )}
    </div>

    {/* 3. ZONA DE PERIGO */}
    <div className="pt-6 border-t border-slate-800/50">
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500/10 border border-slate-800 hover:border-red-500/50 p-4 rounded-2xl transition-all duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
        <span>Encerrar Sessão</span>
      </button>
    </div>

  </div>
)}


        {/* --- VIEW: CREATE STUDENT (CADASTRO DE ALUNO) --- */}
        {activeTab === 'create_student' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setActiveTab('home')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
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
                  onChange={e => setStudentForm({ ...studentForm, nome_completo: e.target.value })}
                  placeholder="Nome Completo do Aluno"
                  className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={studentForm.data_nascimento}
                    onChange={e => setStudentForm({ ...studentForm, data_nascimento: e.target.value })}
                    className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none text-slate-300"
                  />
                  <input
                    type="tel"
                    value={studentForm.telefone}
                    onChange={e => setStudentForm({ ...studentForm, telefone: e.target.value })}
                    placeholder="Telefone / Zap"
                    className="w-full bg-slate-950 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <input
                  value={studentForm.nome_responsavel}
                  onChange={e => setStudentForm({ ...studentForm, nome_responsavel: e.target.value })}
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
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center select-none ${isSelected
                            ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-900/20'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                            }`}
                        >
                          <div>
                            <h5 className={`font-bold transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>{turma.nome}</h5>
                            <p className="text-xs text-slate-500">{turma.horario}</p>
                          </div>

                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                            }`}>
                            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12" /></svg>}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- VIEW: RELATÓRIOS (DASHBOARD ANALÍTICO) --- */}
        {activeTab === 'reports' && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-2xl font-bold text-white mb-2">Relatórios Gerenciais</h3>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1: Frequência Geral */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase">Frequência Média</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-3xl font-bold text-green-400">92%</span>
                  <span className="text-xs text-green-500 mb-1">▲ +2%</span>
                </div>
              </div>

              {/* Card 2: Alunos Ativos */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase">Novos Alunos</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-3xl font-bold text-blue-400">+12</span>
                  <span className="text-xs text-slate-500 mb-1">este mês</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Barras Simulado (Frequência Semanal) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
              <h4 className="text-white font-bold mb-6">Presença Semanal</h4>

              <div className="flex justify-between items-end h-32 gap-2">
                {/* Barra Seg */}
                <div className="flex flex-col items-center gap-2 w-full group">
                  <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative overflow-hidden group-hover:bg-blue-500/30 transition">
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: '85%' }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Seg</span>
                </div>
                {/* Barra Ter */}
                <div className="flex flex-col items-center gap-2 w-full group">
                  <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative overflow-hidden group-hover:bg-blue-500/30 transition">
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: '92%' }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Ter</span>
                </div>
                {/* Barra Qua */}
                <div className="flex flex-col items-center gap-2 w-full group">
                  <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative overflow-hidden group-hover:bg-blue-500/30 transition">
                    <div className="absolute bottom-0 w-full bg-purple-500 rounded-t-lg transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{ height: '98%' }}></div>
                  </div>
                  <span className="text-xs text-white font-bold">Qua</span>
                </div>
                {/* Barra Qui */}
                <div className="flex flex-col items-center gap-2 w-full group">
                  <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative overflow-hidden group-hover:bg-blue-500/30 transition">
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: '75%' }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Qui</span>
                </div>
                {/* Barra Sex */}
                <div className="flex flex-col items-center gap-2 w-full group">
                  <div className="w-full bg-blue-500/20 h-full rounded-t-lg relative overflow-hidden group-hover:bg-blue-500/30 transition">
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: '60%' }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Sex</span>
                </div>
              </div>
            </div>

            {/* Ações de Exportação */}
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-3">Exportar Dados</h4>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition group">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-lg text-red-500 group-hover:bg-red-500 group-hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M9 15l3 3 3-3" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">Relatório Geral de Alunos</p>
                      <p className="text-xs text-slate-500">Formato PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <span className="text-slate-500">⬇</span>
                </button>

                <button className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition group">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13h8" /><path d="M8 17h8" /><path d="M8 9h8" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">Planilha de Frequência</p>
                      <p className="text-xs text-slate-500">Formato Excel • 850 KB</p>
                    </div>
                  </div>
                  <span className="text-slate-500">⬇</span>
                </button>
              </div>
            </div>

          </div>
        )}
        {/* --- VIEW: CREATE USER (CADASTRO DE ADMIN/PROF) --- */}
        {activeTab === 'create_user' && (
          <div className="animate-fade-in max-w-lg mx-auto"> {/* Adicionei max-w-lg para centralizar se a tela for grande */}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Novo Usuário</h3>
              <p className="text-slate-400 text-sm">Cadastre um professor ou administrador para o sistema.</p>
            </div>

            <form
              onSubmit={handleRegisterUser}
              className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md"
            >

              {/* CAMPO: NOME */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={userForm.name || ''} // Proteção contra erro de Uncontrolled Input
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full bg-slate-950 text-white p-4 pl-4 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="Ex: Prof. Girafales"
                  />
                </div>
              </div>

              {/* CAMPO: EMAIL */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">
                  Email Institucional
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="email@escola.com"
                />
              </div>

              {/* CAMPO: SENHA */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={userForm.password || ''}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••"
                />
              </div>

              {/* SELETOR DE TIPO (PROFESSOR / ADMIN) */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setUserForm({ ...userForm, type: 'professor' })}
                  className={`p-4 rounded-xl border font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1
            ${userForm.type === 'professor'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                    }`}
                >
                  <span>👨‍🏫 Professor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserForm({ ...userForm, type: 'admin' })}
                  className={`p-4 rounded-xl border font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1
            ${userForm.type === 'admin'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                    }`}
                >
                  <span>🛡️ Admin</span>
                </button>
              </div>

              {/* BOTÃO DE SALVAR */}
              <button
                disabled={registeringUser}
                className={`w-full mt-4 font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95
          ${registeringUser
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/20'
                  }`}
              >
                {registeringUser ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Salvando...
                  </span>
                ) : (
                  'Cadastrar Membro'
                )}
              </button>

            </form>
          </div>
        )}


      </main>


      {/* --- MENU DOCK (NAVEGAÇÃO INFERIOR) --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex justify-between px-6 items-center z-50">

        <NavButton
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>}
          label="Início"
          active={activeTab === 'home' || activeTab === 'create_student'} // Ativo se estiver na home ou criando aluno
          onClick={() => setActiveTab('home')}
        />
        <NavButton
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><circle cx="12" cy="13" r="4" /><path d="M20 21v-1a4 4 0 0 0-3-3.87" /><path d="M4 21v-1a4 4 0 0 1 3-3.87" /></svg>}
          label="Alunos"
          active={activeTab === 'students'}
          onClick={() => setActiveTab('students')}
        />



        <NavButton
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>}
          label="Turmas"
          active={activeTab === 'classes'}
          onClick={() => setActiveTab('classes')}
        />



        <NavButton
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>}
          label="Relatórios"
          active={activeTab === 'reports'}
          onClick={() => setActiveTab('reports')}
        />

        <NavButton
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
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
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-14 ${active ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
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
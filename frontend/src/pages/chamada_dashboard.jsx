import React, { useState, useEffect } from 'react';

// Simulando dados vindos do seu SELECT * FROM turmas
const MOCK_TURMAS = [
  { id: 1, nome: 'Teatro Iniciante', dias_horarios: 'Seg/Qua 19h', professor_id: 1 },
  { id: 2, nome: 'Interpretação Avançada', dias_horarios: 'Sex 18h', professor_id: 1 },
];

// Simulando SELECT a.id, a.nome_completo FROM alunos a JOIN matriculas m ON a.id = m.aluno_id WHERE m.turma_id = ?
const MOCK_ALUNOS = [
  { id: 101, nome_completo: 'Ana Beatriz Silva' },
  { id: 102, nome_completo: 'Carlos Eduardo Souza' },
  { id: 103, nome_completo: 'Daniela Oliveira' },
  { id: 104, nome_completo: 'Fabrício Mendes' },
];

const ClassroomManager = ({ onBack }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data da aula (Padrão: Hoje)
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);

  // Carregar alunos ao selecionar turma
  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      // AQUI ENTRARIA SEU FETCH: /api/turmas/{selectedClass.id}/alunos
      setTimeout(() => {
        // Inicializa o estado local mapeando para a tabela 'frequencia'
        const initialState = MOCK_ALUNOS.map(aluno => ({
          aluno_id: aluno.id,
          nome_completo: aluno.nome_completo,
          presente: true, // Default: Todo mundo presente
          observacao: ''  // Default: NULL/Vazio
        }));
        setStudents(initialState);
        setLoading(false);
      }, 500);
    }
  }, [selectedClass]);

  // --- LÓGICA DE NEGÓCIO ---

  const handleAttendance = (alunoId, status) => {
    setStudents(prev => prev.map(s => {
      if (s.aluno_id !== alunoId) return s;

      // Mapeamento para seu Schema SQL:
      if (status === 'present') {
        return { ...s, presente: true, observacao: '' };
      } 
      else if (status === 'absent') {
        return { ...s, presente: false, observacao: '' };
      } 
      else if (status === 'justified') {
        return { ...s, presente: false, observacao: 'Falta Justificada' };
      }
      return s;
    }));
  };

  const handleObservationChange = (alunoId, text) => {
    setStudents(prev => prev.map(s => 
      s.aluno_id === alunoId ? { ...s, observacao: text } : s
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Preparando o Payload para o Backend
    // Isso vai gerar múltiplos INSERTS na tabela 'frequencia'
    const payload = students.map(s => ({
      turma_id: selectedClass.id,
      aluno_id: s.aluno_id,
      data_aula: classDate,
      presente: s.presente,
      observacao: s.observacao || null
    }));

    console.log("Enviando para o SQL:", payload);

    // Simulação de API
    setTimeout(() => {
      alert(`Frequência de ${students.length} alunos salva com sucesso!`);
      setIsSaving(false);
      onBack();
    }, 1000);
  };

  // --- CÁLCULO DEMÉTRICAS (KPIs) ---
  const totalStudents = students.length;
  const totalPresent = students.filter(s => s.presente).length;
  const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  // --- VIEW 1: SELEÇÃO DE TURMA ---
  if (!selectedClass) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto p-8">
        <header className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
           <div>
             <h2 className="text-3xl font-light text-white tracking-tight">Diário de Classe</h2>
             <p className="text-slate-500 text-sm mt-1">Selecione uma turma para iniciar a chamada</p>
           </div>
           <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider flex items-center gap-2 border border-slate-700 px-3 py-2 rounded hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Voltar
           </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_TURMAS.map((turma) => (
            <button 
              key={turma.id}
              onClick={() => setSelectedClass(turma)}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-left hover:border-blue-500/50 hover:bg-slate-900/80 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl -mr-6 -mt-6 transition-opacity group-hover:opacity-100 opacity-0"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  {turma.id.toString().padStart(3, '0')}
                </span>
                <span className="text-slate-400 text-xs font-mono bg-slate-950 px-2 py-1 rounded">
                   {turma.dias_horarios}
                </span>
              </div>
              
              <h3 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors relative z-10">
                {turma.nome}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                 <span>Selecionar Turma</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: CHAMADA (FREQUÊNCIA) ---
  return (
    <div className="animate-fade-in max-w-5xl mx-auto p-6 pb-20">
      
      {/* HEADER EXECUTIVO */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
           <button onClick={() => setSelectedClass(null)} className="text-xs text-slate-500 hover:text-white mb-3 flex items-center gap-1 transition-colors">
             ← Trocar Turma
           </button>
           <h2 className="text-2xl font-light text-white tracking-tight">{selectedClass.nome}</h2>
           <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                 {selectedClass.dias_horarios}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span>{students.length} Alunos matriculados</span>
           </div>
        </div>

        {/* DATA E MÉTRICA */}
        <div className="flex items-center gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">Data da Aula</label>
              <input 
                type="date" 
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="bg-slate-950 text-white text-sm p-2 rounded border border-slate-800 focus:border-blue-500 outline-none w-40"
              />
           </div>
           
           <div className="hidden md:block text-right bg-slate-900 border border-slate-800 rounded-lg p-3 px-4">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Presença Hoje</span>
              <span className={`text-xl font-light ${attendanceRate < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                 {attendanceRate}%
              </span>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Carregando lista de alunos...</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          
          {/* CABEÇALHO DA TABELA */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-950/50 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
             <div className="col-span-5 md:col-span-4">Aluno (Matrícula Ativa)</div>
             <div className="col-span-4 md:col-span-3 text-center">Status (Frequência)</div>
             <div className="col-span-3 md:col-span-5">Observação (Opcional)</div>
          </div>

          <div className="divide-y divide-slate-800">
             {students.map((aluno) => {
                // Lógica visual para os botões baseado no schema
                // Presente = true
                // Ausente = false (com obs vazia)
                // Justificado = false (com obs preenchida)
                const isPresent = aluno.presente === true;
                const isAbsent = aluno.presente === false && !aluno.observacao;
                const isJustified = aluno.presente === false && aluno.observacao && aluno.observacao.length > 0;

                return (
                  <div key={aluno.aluno_id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors">
                     
                     {/* NOME DO ALUNO */}
                     <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border transition-colors ${
                           isPresent ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                           'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                           {aluno.nome_completo.charAt(0)}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${isPresent ? 'text-white' : 'text-slate-400'}`}>
                           {aluno.nome_completo}
                        </span>
                     </div>

                     {/* BOTÕES DE AÇÃO */}
                     <div className="col-span-4 md:col-span-3 flex justify-center">
                        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 shadow-inner">
                           {/* BOTÃO PRESENTE (True) */}
                           <button 
                              onClick={() => handleAttendance(aluno.aluno_id, 'present')}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                 isPresent ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                              }`}
                              title="Presente"
                           >
                              P
                           </button>
                           {/* BOTÃO FALTA (False) */}
                           <button 
                              onClick={() => handleAttendance(aluno.aluno_id, 'absent')}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                 isAbsent ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                              }`}
                              title="Falta"
                           >
                              F
                           </button>
                           {/* BOTÃO JUSTIFICADO (False + Obs) */}
                           <button 
                              onClick={() => handleAttendance(aluno.aluno_id, 'justified')}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                 isJustified ? 'bg-amber-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                              }`}
                              title="Justificado"
                           >
                              J
                           </button>
                        </div>
                     </div>

                     {/* INPUT DE OBSERVAÇÃO (Schema: observacao TEXT) */}
                     <div className="col-span-3 md:col-span-5">
                        <input 
                           type="text" 
                           value={aluno.observacao || ''}
                           onChange={(e) => handleObservationChange(aluno.aluno_id, e.target.value)}
                           placeholder="Observação (Ex: Saiu cedo)"
                           className={`w-full bg-transparent border-b border-transparent focus:border-blue-500 text-xs text-slate-300 placeholder:text-slate-700 outline-none py-1 transition-colors ${
                              isJustified ? 'border-amber-500/50 text-amber-200' : ''
                           }`}
                        />
                     </div>
                  </div>
                );
             })}
          </div>
        </div>
      )}

      {/* FOOTER DE AÇÃO */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-50">
         <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="text-xs text-slate-500 hidden md:block">
               <span className="text-emerald-500 font-bold">P</span> = Presente (True) • 
               <span className="text-red-500 font-bold ml-2">F</span> = Falta (False) • 
               <span className="text-amber-500 font-bold ml-2">J</span> = Justificado (False + Obs)
            </div>
            <button 
               onClick={handleSave}
               disabled={isSaving}
               className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
            >
               {isSaving ? (
                  <>
                     <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                     Salvando Dados...
                  </>
               ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                     Salvar Chamada
                  </>
               )}
            </button>
         </div>
      </div>

    </div>
  );
};

export default ClassroomManager;
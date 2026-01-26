from flask import Blueprint, jsonify, request
from app import db
# IMPORTANTE: Importando tudo o que precisa para não dar erro de "not defined"
from app.models.tables import Turma, Usuario, Aluno, Matricula

bp = Blueprint('turmas', __name__, url_prefix='/turmas')

# Rota 1: Listar Turmas (Corrigido CORS removendo a barra final)
@bp.route('', methods=['GET'])
def listar_turmas():
    turmas = Turma.query.all()
    lista = []
    for t in turmas:
        prof = Usuario.query.get(t.professor_id) if t.professor_id else None
        lista.append({
            "id": t.id,
            "nome": t.nome,
            "horario": t.dias_horarios,
            "professor": prof.nome if prof else "Sem Prof."
        })
    return jsonify(lista), 200

# Rota 2: Criar Turma (Corrigido CORS)
@bp.route('', methods=['POST'])
def criar_turma():
    dados = request.json
    if not dados.get('nome'):
        return jsonify({"erro": "Nome obrigatório"}), 400
    try:
        nova_turma = Turma(nome=dados['nome'], dias_horarios=dados.get('horario'))
        db.session.add(nova_turma)
        db.session.commit()
        return jsonify({"mensagem": "Turma criada!", "id": nova_turma.id}), 201
    except Exception:
        return jsonify({"erro": "Erro ao criar"}), 500

# --- A NOVA ROTA QUE VOCÊ PEDIU ---
# Busca a turma pelo ID e traz os alunos vinculados
@bp.route('/<int:id>', methods=['GET'])
def get_turma_com_alunos(id):
    turma = Turma.query.get(id)
    if not turma:
        return jsonify({"erro": "Turma não encontrada"}), 404

    # Busca o professor
    prof = Usuario.query.get(turma.professor_id) if turma.professor_id else None

    # MÁGICA: Junta Aluno com Matricula para achar quem é dessa turma
    alunos = db.session.query(Aluno).join(Matricula).filter(Matricula.turma_id == id).all()

    return jsonify({
        "id": turma.id,
        "nome": turma.nome,
        "horario": turma.dias_horarios,
        "professor": prof.nome if prof else "Sem Prof.",
        "alunos": [{
            "id": a.id,
            "nome": a.nome_completo,
            "telefone": a.telefone
        } for a in alunos]
    }), 200
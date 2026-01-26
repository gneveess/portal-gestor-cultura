from flask import Blueprint, request, jsonify
from app import db
from app.models.tables import Aluno, Matricula, Turma

bp = Blueprint('alunos', __name__, url_prefix='/alunos')

# Rota para Cadastrar Aluno + Matricular em Turmas
@bp.route('', methods=['POST'])
def criar_aluno():
    dados = request.json
    
    # 1. Validação Básica
    if not dados.get('nome_completo'):
        return jsonify({"erro": "Nome é obrigatório"}), 400

    try:
        # 2. Cria o Aluno
        novo_aluno = Aluno(
            nome_completo=dados['nome_completo'],
            data_nascimento=dados.get('data_nascimento'), # Formato YYYY-MM-DD
            nome_responsavel=dados.get('nome_responsavel'),
            telefone=dados.get('telefone')
        )
        
        db.session.add(novo_aluno)
        db.session.flush() # Gera o ID do aluno sem fechar a transação

        # 3. Processa as Matrículas (Se houver turmas selecionadas)
        turmas_ids = dados.get('turmas_ids', []) # Espera uma lista: [1, 5, 8]
        
        for turma_id in turmas_ids:
            # Verifica se a turma existe
            turma = Turma.query.get(turma_id)
            if turma:
                nova_matricula = Matricula(
                    aluno_id=novo_aluno.id,
                    turma_id=turma.id
                )
                db.session.add(nova_matricula)

        # 4. Salva TUDO (Aluno + Matrículas) de uma vez
        db.session.commit()

        return jsonify({
            "mensagem": "Aluno cadastrado e matriculado com sucesso!",
            "aluno_id": novo_aluno.id,
            "qr_code": str(novo_aluno.codigo_qr_token)
        }), 201

    except Exception as e:
        db.session.rollback() # Cancela tudo se der erro
        return jsonify({"erro": f"Erro ao cadastrar: {str(e)}"}), 
        


@bp.route('', methods=['GET'])
def listar_alunos():
    try:
        # Busca todos os alunos
        alunos = Aluno.query.order_by(Aluno.nome_completo).all()
        
        lista_alunos = []
        for a in alunos:
            # Tenta achar a turma que o aluno está (pega a primeira encontrada)
            matricula = Matricula.query.filter_by(aluno_id=a.id).first()
            nome_turma = "Sem Matrícula"
            
            if matricula:
                turma = Turma.query.get(matricula.turma_id)
                if turma:
                    nome_turma = turma.nome

            lista_alunos.append({
                "id": a.id,
                "nome": a.nome_completo,
                "matricula": str(a.id).zfill(5), # Ex: transforma id 1 em "00001"
                "turma": nome_turma,
                "status": "ativo" if a.ativo else "inativo",
                "foto": None # Se tiver campo foto no banco, coloque aqui
            })
            
        return jsonify(lista_alunos), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
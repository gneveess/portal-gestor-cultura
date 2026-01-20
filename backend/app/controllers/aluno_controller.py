from flask import Blueprint, request, jsonify
from app import db
from app.models.tables import Aluno

# Cria o grupo de rotas "/alunos"
bp = Blueprint('alunos', __name__, url_prefix='/alunos')

@bp.route('/criar', methods=['POST'])
def criar_aluno():
    """
    Recebe um JSON com os dados e cria um novo aluno no Banco.
    Exemplo de JSON: { "nome": "João da Silva", "nascimento": "2000-01-01" }
    """
    dados = request.json

    # Validação simples
    if not dados or 'nome' not in dados:
        return jsonify({"erro": "O campo 'nome' é obrigatório"}), 400

    try:
        # Cria o objeto Aluno (O Python converte isso pra SQL sozinho)
        novo_aluno = Aluno(
            nome_completo=dados['nome'],
            data_nascimento=dados.get('nascimento'), # .get evita erro se não vier
            telefone=dados.get('telefone')
        )

        db.session.add(novo_aluno) # Adiciona na sessão
        db.session.commit()        # Salva de verdade no Banco

        return jsonify({
            "mensagem": "Aluno cadastrado com sucesso!", 
            "id": novo_aluno.id,
            "qr_code_token": str(novo_aluno.codigo_qr_token)
        }), 201

    except Exception as e:
        return jsonify({"erro": f"Erro ao salvar: {str(e)}"}), 500

@bp.route('/', methods=['GET'])
def listar_alunos():
    """ Busca todos os alunos no banco e devolve em JSON """
    alunos = Aluno.query.all()
    
    # Converte a lista de objetos Python para uma lista de JSONs
    lista_json = [aluno.to_json() for aluno in alunos]
    
    return jsonify(lista_json), 200
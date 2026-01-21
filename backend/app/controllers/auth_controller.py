from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.tables import Usuario
from app.models.tables import Usuario, TipoUsuario
from app import db


bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/login', methods=['POST'])
def login():
    dados = request.json or {}
    email = dados.get('email')
    senha = dados.get('password')

    if not email or not senha:
        return jsonify({'erro': 'Email e senha são obrigatórios.'}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado.'}), 401

    if not check_password_hash(usuario.senha_hash, senha):
        return jsonify({'erro': 'Senha inválida.'}), 401

    return jsonify({'usuario': usuario.to_json()}), 200

@bp.route('/users', methods=['GET'])
def list_users():
    try:
        # Busca todos os usuários, ordenando do mais novo para o mais antigo
        users = Usuario.query.order_by(Usuario.criado_em.desc()).all()
        
        # Converte para JSON usando o método .to_json() que criamos na tabela
        return jsonify([u.to_json() for u in users]), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar usuários"}), 500


# --- NOVA ROTA EXCLUSIVA PARA O ADMIN ---
@bp.route('/create_user', methods=['POST'])
def create_user():
    dados = request.json
    
    # 1. Validação dos dados obrigatórios
    if not dados.get('email') or not dados.get('password') or not dados.get('name') or not dados.get('type'):
        return jsonify({"erro": "Todos os campos são obrigatórios (nome, email, senha, tipo)."}), 400

    # 2. Verifica se o e-mail já existe no banco
    if Usuario.query.filter_by(email=dados['email']).first():
        return jsonify({"erro": "Este e-mail já está em uso."}), 400

    try:
        # 3. Criptografa a senha
        senha_segura = generate_password_hash(dados['password'])
        
        # 4. Define o tipo corretamente baseado no que o Admin escolheu
        tipo_escolhido = TipoUsuario.ADMIN if dados['type'] == 'admin' else TipoUsuario.PROFESSOR

        # 5. Cria o novo usuário
        novo_usuario = Usuario(
            nome=dados['name'],
            email=dados['email'],
            senha_hash=senha_segura,
            tipo=tipo_escolhido
        )

        db.session.add(novo_usuario)
        db.session.commit()

        return jsonify({
            "mensagem": "Usuário criado com sucesso pelo Administrador!", 
            "id": novo_usuario.id
        }), 201

    except Exception as e:
        return jsonify({"erro": f"Erro interno ao criar usuário: {str(e)}"}), 500
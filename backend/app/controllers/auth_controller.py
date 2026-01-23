from flask import Blueprint, request, jsonify
# --- CORREÇÃO 1: Importando as ferramentas de segurança ---
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
# --- CORREÇÃO 2: Importando as tabelas necessárias (Usuario, TipoUsuario, Turma) ---
from app.models.tables import Usuario, TipoUsuario, Turma

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    # ... (código antigo mantido, mas não estamos usando muito esse)
    return jsonify({"msg": "Use a rota create_user no painel admin"}), 200

# Rota de Login
@bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    senha = dados.get('password')

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"erro": "E-mail ou senha incorretos."}), 401

    return jsonify({
        "mensagem": "Login realizado!",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "tipo": usuario.tipo.value
        }
    }), 200

# Rota de Listagem
@bp.route('/users', methods=['GET'])
def list_users():
    try:
        users = Usuario.query.order_by(Usuario.criado_em.desc()).all()
        return jsonify([u.to_json() for u in users]), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar usuários"}), 500

# Rota de Exclusão
@bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404
            
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"mensagem": "Usuário excluído com sucesso!"}), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao excluir"}), 500

# Rota de Criação de Usuário (Admin)
@bp.route('/create_user', methods=['POST'])
def create_user():
    dados = request.json
    
    if not dados.get('email') or not dados.get('password') or not dados.get('name') or not dados.get('type'):
        return jsonify({"erro": "Todos os campos são obrigatórios."}), 400

    if Usuario.query.filter_by(email=dados['email']).first():
        return jsonify({"erro": "Este e-mail já está em uso."}), 400

    try:
        # Agora o generate_password_hash vai funcionar!
        senha_segura = generate_password_hash(dados['password'])
        
        # Agora o TipoUsuario vai funcionar!
        tipo_escolhido = TipoUsuario.ADMIN if dados['type'] == 'admin' else TipoUsuario.PROFESSOR

        novo_usuario = Usuario(
            nome=dados['name'],
            email=dados['email'],
            senha_hash=senha_segura,
            tipo=tipo_escolhido
        )

        db.session.add(novo_usuario)
        db.session.flush()

        # Atribuição de Turmas (Agora Turma também está importada!)
        turmas_ids = dados.get('turmas_ids', [])
        if turmas_ids and tipo_escolhido == TipoUsuario.PROFESSOR:
            for t_id in turmas_ids:
                turma = Turma.query.get(t_id)
                if turma:
                    turma.professor_id = novo_usuario.id

        db.session.commit()

        return jsonify({
            "mensagem": "Usuário criado com sucesso!", 
            "id": novo_usuario.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": f"Erro interno ao criar usuário: {str(e)}"}), 500
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # 1. Configuração Padrão do CORS
    CORS(app, resources={r"/*": {"origins": "*"}}) 

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configuração para evitar queda de conexão com o Banco
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": True,  
        "pool_recycle": 300,
    }

    db.init_app(app)

    # 2. REGISTRO DOS BLUEPRINTS (ROTAS)
    from app.controllers.auth_controller import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.controllers.aluno_controller import bp as alunos_bp
    app.register_blueprint(alunos_bp)
    
    from app.controllers.turma_controller import bp as turmas_bp
    app.register_blueprint(turmas_bp)

    
    @app.route('/')
    def health_check():
        return "API Online! 🚀"

    return app
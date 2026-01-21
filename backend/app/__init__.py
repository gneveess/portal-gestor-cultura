from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/*": {"origins": "*"}}) 

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- ADICIONE ESTE BLOCO AQUI ---
    # Isso faz o Python checar a conexão antes de usar.
    # Se caiu, ele reconecta sozinho sem dar erro.
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": True,  
        "pool_recycle": 300,
    }
    # --------------------------------

    db.init_app(app)

    # Importações dos Blueprints
    from app.controllers import aluno_controller
    app.register_blueprint(aluno_controller.bp)

    from app.controllers.auth_controller import bp as auth_bp
    app.register_blueprint(auth_bp)

    @app.route('/')
    def health_check():
        return "API Online! 🚀"

    return app
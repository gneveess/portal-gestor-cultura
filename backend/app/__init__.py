from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS # Importante
import os
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # --- CORREÇÃO AQUI ---
    # resources={r"/*": {"origins": "*"}} -> Libera TUDO para TODOS as rotas
    # Isso resolve o erro 404 no OPTIONS
    CORS(app, resources={r"/*": {"origins": "*"}}) 
    # ---------------------

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Importar e Registrar os Blueprints
    from app.controllers import aluno_controller
    app.register_blueprint(aluno_controller.bp)

    from app.controllers import auth_controller
    app.register_blueprint(auth_controller.bp)

    @app.route('/')
    def health_check():
        return "API Online! 🚀"

    return app
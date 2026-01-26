from app import create_app, db
from app.models.tables import Usuario, TipoUsuario
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Verifica se já existe
    if Usuario.query.filter_by(email="admin@sistema.com").first():
        print("Admin já existe!")
    else:
        senha_hash = generate_password_hash("admin123")
        admin = Usuario(
            nome="Super Admin",
            email="admin@sistema.com",
            senha_hash=senha_hash,
            tipo=TipoUsuario.ADMIN
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Usuário Admin criado com sucesso!")
        print("Email: admin@sistema.com")
        print("Senha: admin123")
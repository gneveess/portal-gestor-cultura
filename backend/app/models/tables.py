from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum # <--- ESTE IMPORT É FUNDAMENTAL
from datetime import datetime

# 1. Definindo o Enum (Isso é o que estava faltando/dando erro)
class TipoUsuario(enum.Enum):
    ADMIN = "admin"
    PROFESSOR = "professor"



# 1. Tabela de Usuários (Gestores e Professores)
class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    
    # Usa a classe TipoUsuario criada acima
    tipo = db.Column(db.Enum(TipoUsuario), default=TipoUsuario.PROFESSOR, nullable=False)
    
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

   # Relacionamento com turmas
    turmas = db.relationship('Turma', backref='professor', lazy=True)

    def to_json(self):
        return {
            "id": self.id, 
            "nome": self.nome, 
            "email": self.email, 
            "tipo": self.tipo.value
        }

# 3. Tabela de Alunos
class Aluno(db.Model):
    __tablename__ = 'alunos'

    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(150), nullable=False)
    data_nascimento = db.Column(db.Date)
    nome_responsavel = db.Column(db.String(150))
    telefone = db.Column(db.String(20))
    
    # Gera UUID automaticamente
    codigo_qr_token = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    
    ativo = db.Column(db.Boolean, default=True)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome_completo,
            "qr_code": str(self.codigo_qr_token),
            "ativo": self.ativo
        }

# 4. Tabela de Turmas
class Turma(db.Model):
    __tablename__ = 'turmas'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    dias_horarios = db.Column(db.String(100))
    professor_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

# 5. Tabela Associativa: Matrículas (Aluno <-> Turma)
class Matricula(db.Model):
    __tablename__ = 'matriculas'

    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('alunos.id'), nullable=False)
    turma_id = db.Column(db.Integer, db.ForeignKey('turmas.id'), nullable=False)
    data_matricula = db.Column(db.DateTime, default=datetime.utcnow)

# 6. Tabela de Frequência
class Frequencia(db.Model):
    __tablename__ = 'frequencia'

    id = db.Column(db.Integer, primary_key=True)
    turma_id = db.Column(db.Integer, db.ForeignKey('turmas.id'), nullable=False)
    aluno_id = db.Column(db.Integer, db.ForeignKey('alunos.id'), nullable=False)
    data_aula = db.Column(db.Date, nullable=False)
    presente = db.Column(db.Boolean, default=False)
    observacao = db.Column(db.Text)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
# 🎭 Portal Gestor da Cultura

> Sistema de gestão escolar focado em instituições culturais, com interface Mobile First e integração de dados em tempo real.

![Badge em Desenvolvimento](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Badge Mobile First](https://img.shields.io/badge/Design-Mobile_First-blueviolet)

## 📖 Sobre o Projeto

O **Portal Gestor da Cultura** é uma solução web desenvolvida para modernizar a administração de oficinas, cursos e turmas em instituições culturais.

O principal diferencial do projeto é sua abordagem **Mobile First**, permitindo que professores realizem chamadas e acessem dados dos alunos diretamente da sala de aula/teatro via smartphone. Além disso, o sistema elimina a necessidade de dashboards complexos no MVP ao integrar-se nativamente com a **Google Sheets API**, exportando relatórios de frequência e cadastros automaticamente para planilhas de gestão.

## 🚀 Funcionalidades Principais

* **📱 Mobile First Design:** Interface otimizada para toque e telas verticais (smartphones).
* **🔐 Controle de Acesso:** Níveis de permissão distintos para **Gestores** (Admin) e **Professores**.
* **📝 Gestão de Turmas e Alunos:** Cadastro completo com geração automática de **ID** e Ficha Digital.
* **🆔 Identificação QR Code:** Ficha do aluno contendo QR Code para validação rápida de identidade.
* **✅ Chamada Digital:** Interface rápida para registro de presença/falta pelo professor.
* **📊 Integração Google Sheets:** Sincronização automática dos dados de frequência para geração de relatórios externos.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* [React.js](https://reactjs.org/) (Sugerido)
* [Tailwind CSS](https://tailwindcss.com/) (Para estilização responsiva)
* Lucide Icons / FontAwesome

**Backend:**
* [Python Flask](https://flask.palletsprojects.com/) ou [Node.js](https://nodejs.org/)
* SQLAlchemy / Prisma ORM
* **Google Sheets API** (gspread / google-googleapis)

**Banco de Dados:**
* SQLite (Desenvolvimento) / PostgreSQL (Produção)

## ⚙️ Pré-requisitos e Configuração

Antes de começar, você precisará ter instalado em sua máquina:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/en/) (se usar React/Node)
* [Python](https://www.python.org/) (se usar Flask)

### Passos para Instalação

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/seu-usuario/portal-gestor-cultura.git](https://github.com/seu-usuario/portal-gestor-cultura.git)
    cd portal-gestor-cultura
    ```

2.  **Configuração do Backend**
    ```bash
    # Exemplo para Python
    cd backend
    python -m venv venv
    source venv/bin/activate  # ou venv\Scripts\activate no Windows
    pip install -r requirements.txt
    ```

3.  **Configuração das Credenciais Google**
    * Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/).
    * Habilite a **Google Sheets API** e **Google Drive API**.
    * Crie uma *Service Account* e baixe o arquivo JSON.
    * Renomeie para `credentials.json` e coloque na pasta raiz do backend.
    * **Importante:** Compartilhe a planilha alvo com o e-mail da sua Service Account.

4.  **Configuração do Frontend**
    ```bash
    cd frontend
    npm install
    npm start
    ```

## 📂 Estrutura do Projeto    
portal-gestor-cultura/ ├── backend/ │ ├── app/ │ │ ├── controllers/ │ │ ├── models/ │ │ └── services/ (Lógica do Google Sheets aqui) │ ├── credentials.json (NÃO SUBIR PRO GITHUB) │ └── requirements.txt ├── frontend/ │ ├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ └── services/ │ └── package.json └── README.md







## 📅 Roadmap e Futuro

- [x] MVP: Cadastro e Chamada
- [x] Integração Google Sheets
- [ ] Módulo Financeiro
- [ ] App PWA (Instalável)
- [ ] Notificações Push para faltas

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/IncrivelFeature`)
3.  Faça o Commit (`git commit -m 'Add some IncrivelFeature'`)
4.  Faça o Push (`git push origin feature/IncrivelFeature`)
5.  Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido por Gabriel Neves Ferreira. 🚀

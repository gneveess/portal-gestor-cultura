from app import create_app

app = create_app()

if __name__ == '__main__':
    # O debug=True ajuda a ver os erros na tela enquanto desenvolve
    # host='0.0.0.0' libera o acesso para a rede Wi-Fi
    app.run(debug=True, port=5000, host='0.0.0.0')  
    
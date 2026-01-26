// Substitua pelo SEU endereço IP se for testar no celular
// Se for só no PC, pode usar 'http://localhost:5000'
export const API_URL = 'http://localhost:5000'; 

// Função ajudante para fazer as requisições
export const request = async (endpoint, method, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};
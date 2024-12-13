// Define a URL base da API como 'http://localhost:3000/api'.
const API_URL = 'http://localhost:3001/api';

async function login(email, password) {
    try {
        // Exibe no console os dados de login que serão enviados ao servidor.
        console.log('Enviando dados para login:', { email, password });
        
        // Envia uma requisição POST à API na rota '/auth/login'.
        // A requisição inclui um cabeçalho para indicar que o conteúdo é JSON e envia o 'email' e 'password' no corpo da requisição.
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', // Define o método HTTP como POST.
            headers: {
                'Content-Type': 'application/json' // Informa que o corpo da requisição está no formato JSON.
            },
            body: JSON.stringify({ email, password }) // Converte os dados de login para o formato JSON e envia no corpo da requisição.
        });

        // Aguarda e converte a resposta do servidor para JSON.
        const result = await response.json();
        
        // Exibe no console a resposta recebida do servidor.
        console.log('Resposta do servidor para login:', result);
        
        // Retorna o resultado da requisição.
        return result;
    } catch (error) {
        // Captura qualquer erro que ocorra durante a requisição e exibe no console.
        console.error('Erro ao fazer login:', error);
        
        // Retorna um objeto com 'success: false' indicando que o login falhou.
        return { success: false };
    }
}
// Define a URL base da API como 'http://localhost:3000/api'.
const API_URL = 'http://localhost:3001/api';

// Função para registrar um novo usuário
async function cadastro(nome_usuario, email, senha, setor) {
    try {
        // Exibe no console os dados que estão sendo enviados ao servidor para registro.
        console.log('Enviando dados para registro:', { nome_usuario, email, senha, setor });
        // Envia uma requisição POST para a API no endpoint '/authen/cadastro' com os dados do novo usuário.
        const response = await fetch(`${API_URL}/authen/cadastro`, {
            method: 'POST', // Define o método HTTP como POST para enviar dados.
            headers: {
                'Content-Type': 'application/json' // Define o cabeçalho, informando que o corpo da requisição será em formato JSON.
            },
            body: JSON.stringify({ nome_usuario, email, senha, setor }) // Converte os dados do registro em uma string JSON e os envia no corpo da requisição.
        });
        // Verifica se o código de resposta HTTP está fora da faixa de 200-299 (indicando uma falha na requisição).
        if (!response.ok) {
            throw new Error('Falha na requisição. Código de status: ' + response.status); // Lança um erro com o código de status da resposta.
        }
        // Recebe a resposta do servidor como JSON.
        const result = await response.json();
        console.log('Resposta do servidor para registro:', result); // Exibe a resposta do servidor no console.
        // Retorna um objeto indicando que o registro foi bem-sucedido, juntamente com a resposta do servidor.
        return { success: true, message: result };
    } catch (error) {
        // Captura qualquer erro ocorrido durante o processo de requisição e exibe no console.
        console.error('Erro ao registrar:', error.message);
        // Retorna um objeto indicando que o registro falhou, incluindo a mensagem de erro.
        return { success: false, message: error.message };
    }
}

async function login(email, senha) {
    try {
        // Exibe no console os dados de login que serão enviados ao servidor.
        console.log('Enviando dados para login:', { email, senha, setor });
        // Envia uma requisição POST à API na rota '/authen/login'.
        // A requisição inclui um cabeçalho para indicar que o conteúdo é JSON e envia o 'email' e 'password' no corpo da requisição.
        const response = await fetch(`${API_URL}/authen/login`, {
            method: 'POST', // Define o método HTTP como POST.
            headers: {
                'Content-Type': 'application/json' // Informa que o corpo da requisição está no formato JSON.
            },
            body: JSON.stringify({ email, senha, setor}) // Converte os dados de login para o formato JSON e envia no corpo da requisição.
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
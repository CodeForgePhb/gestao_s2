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

/*----------------Rotas docente--------------*/
// Função para fazer o login
async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/authen/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();
        return result; // Retorna o resultado da API (token, mensagem de erro, etc.)
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return { success: false, message: 'Erro ao conectar ao servidor.' };
    }
}

// Função para buscar o setor do usuário com base no token
async function buscarSetor(token) {
    try {
        const response = await fetch(`${API_URL}/authen/usuario/setor`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        return result; // Retorna o setor ou mensagem de erro
    } catch (error) {
        console.error('Erro ao buscar setor do usuário:', error);
        return { success: false, message: 'Erro ao conectar ao servidor.' };
    }
}

async function getCursosVigentes() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/routes/cursos-vigentes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { cursos: [] }; // Retorna um array vazio em caso de erro
    }
}

async function getCursosConcluidos() { //FALTA EDITAR, AINDA NÃO ESTA FUNCIONANDO
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/routes/cursos-concluidos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { cursos: [] }; // Retorna um array vazio em caso de erro
    }
}

async function getNome() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/routes/nome`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar o nome:', error);
        return { nome: [] }; // Retorna um array vazio em caso de erro
    }
}
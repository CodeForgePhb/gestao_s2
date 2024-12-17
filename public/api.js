

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

// async function login(email, senha) {
//     try {
//         // Exibe no console os dados de login que serão enviados ao servidor.
//         console.log('Enviando dados para login:', { email, senha, setor });
//         // Envia uma requisição POST à API na rota '/authen/login'.
//         // A requisição inclui um cabeçalho para indicar que o conteúdo é JSON e envia o 'email' e 'password' no corpo da requisição.
//         const response = await fetch(`${API_URL}/authen/login`, {
//             method: 'POST', // Define o método HTTP como POST.
//             headers: {
//                 'Content-Type': 'application/json' // Informa que o corpo da requisição está no formato JSON.
//             },
//             body: JSON.stringify({ email, senha, setor}) // Converte os dados de login para o formato JSON e envia no corpo da requisição.
//         });
//         // Aguarda e converte a resposta do servidor para JSON.
//         const result = await response.json();
//         // Exibe no console a resposta recebida do servidor.
//         console.log('Resposta do servidor para login:', result);
//         // Retorna o resultado da requisição.
//         return result;
//     } catch (error) {
//         // Captura qualquer erro que ocorra durante a requisição e exibe no console.
//         console.error('Erro ao fazer login:', error);
//         // Retorna um objeto com 'success: false' indicando que o login falhou.
//         return { success: false };
//     }
// }


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

    //Enviar uma requisição GET para a rota 'transactions' da API para obter todas as transações
    const token = localStorage.getItem('token')
    

    const response = await fetch(`${API_URL}/cursos-vigentes`,{

        method: 'GET', // Define o método HTTP como GET, que solicita dados do servidor sem enviar informações no corpo.

        headers:{
            //Inclui o tokem JWT no cabeçãlho Authorization para autenticar a requisição, necessário para acessar rotas protegidas
            
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Obtém o tokem do localStorage e envia em formato Bearer Token.
        }
    });

    //Converte a resposta do servidor para JSON e retorna para ser usada na aplicação.

    return response.json(); //Retorna o objeto JSON da resposta

}



async function getCursosVigentes() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('Token não encontrado');
        return;
    }

    // Decodifica o token e obtém o nome do professor
    const decoded = jwt_decode(token);
    const professor = decoded.professor || '';  // Substitua 'professor' pela chave certa

    if (!professor) {
        console.log('Professor não encontrado no token');
        return;
    }

    const response = await fetch(`${API_URL}/cursos-vigentes?professor=${professor}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const cursos = await response.json();
    console.log('Cursos recebidos:', cursos);
    return cursos;
}
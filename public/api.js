// Define a URL base da API como 'http://localhost:3000/api'.
const API_URL = 'http://localhost:3001/api';
// Função para registrar um novo usuário
export async function cadastro(nome, email, senha, setor) {
    try {
        // Exibe no console os dados que estão sendo enviados ao servidor para registro.
        console.log('Enviando dados para registro:', { nome, email, senha, setor });
        // Envia uma requisição POST para a API no endpoint '/authen/cadastro' com os dados do novo usuário.
        const response = await fetch(`${API_URL}/authen/cadastro`, {
            method: 'POST', // Define o método HTTP como POST para enviar dados.
            headers: {
                'Content-Type': 'application/json' // Define o cabeçalho, informando que o corpo da requisição será em formato JSON.
            },
            body: JSON.stringify({ nome, email, senha, setor }) // Converte os dados do registro em uma string JSON e os envia no corpo da requisição.
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
export function monitorarTokenExpiracao() {
    const token = localStorage.getItem('token');

    try {
        // Decodifica o token JWT sem verificá-lo (somente client-side decoding)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Verifica se o token possui uma propriedade de expiração
        if (!payload.exp) {
            console.error('Token inválido: não contém a data de expiração.');
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            logoutUser();
            return;
        }

        // Verifica a expiração do token
        const expirationTime = payload.exp * 1000; // Converter para milissegundos
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;
        const timeBeforeExpiration = timeUntilExpiration - 60000; // 1 minuto antes da expiração
        if (timeUntilExpiration > 0) {
            console.log('Token válido. Tempo restante:', timeUntilExpiration / 1000, 'segundos');
            if (timeBeforeExpiration > 0) {
                // Chama a função 1 minuto antes da expiração
                setTimeout(() => {
                    console.log('Token expirando em breve. Por favor, faça login novamente.');
                    alert('Sua sessão está prestes a expirar. Por favor, faça login novamente.');
                    logoutUser();
                }, timeBeforeExpiration);
            }
        } else {
            console.error('Token expirado.');
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            logoutUser();
            return;
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        alert('Erro ao verificar a sessão. Faça login novamente.');
        logoutUser();
        return;
    } finally {
        // Agendar a próxima verificação após 1 minuto
        setTimeout(monitorarTokenExpiracao, 2 * 60 * 1000);
    }
}

// Função para fazer o login
export async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/authen/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const result = await response.json();
        console.log('Resposta do servidor:', result);  // Verifique o conteúdo da resposta
        if (result.token) {
            return result;
        } else {
            alert(result.message || 'Erro ao fazer login.');
        }
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return { success: false, message: 'Erro ao conectar ao servidor.' };
    }
}

// Função para deslogar o usuário
export async function logoutUser() {
    try {
        // Obtém o token de autenticação do localStorage
        const token = localStorage.getItem('token');
        // Se o token existir, envie a requisição de logout
        if (token) {
            const response = await fetch(`${API_URL}/authen/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token para o servidor
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin', // Mantém a sessão entre o frontend e o backend
            });
            // Verifica se a resposta é válida
            if (!response.ok) {
                throw new Error(`Falha no logout: ${response.statusText}`);
            }
            const data = await response.json();
            // Verifica se o logout foi bem-sucedido
            if (data.message === 'Logout bem-sucedido') {
                // Remove o token do localStorage
                localStorage.removeItem('token');
                console.log('Usuário deslogado.');
                window.location.href = 'index.html'; // Redireciona para a página de login após logout
            } else {
                throw new Error('Falha no logout');
            }
        } else {
            console.error('Token não encontrado');
            alert('Token não encontrado. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao deslogar:', error);
        alert('Houve um erro ao tentar deslogar. Tente novamente.');
    }
}
// Função para solicitar a redefinição de senha
export async function requestResetSenha(email) {
    try {
        const response = await fetch(`${API_URL}/authen/request-reset-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao solicitar redefinição de senha.');
        }

        const result = await response.text();
        console.log('Resposta do servidor:', result);
        return { success: true};
    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error.message);
        return { success: false, message: error.message };
    }
}


// Função para buscar o setor do usuário com base no token
export async function buscarSetor(token) {
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
export async function getCursosVigentes() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/routes/all-cursos-vigentes`, {
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


export async function getCursosConcluidos() { //FALTA EDITAR, AINDA NÃO ESTA FUNCIONANDO
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


export async function getNome() {
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/authen/usuario/nome`, {
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
        return { nome: 'Erro ao buscar nome' }; // Retorna um array vazio em caso de erro
    }
}

// Função para enviar imagem de perfil
export async function uploadProfileImage(file) {
    const token = localStorage.getItem('token'); // Supondo que o token JWT esteja armazenado no localStorage
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    const formData = new FormData();
    formData.append('profileImage', file); // O campo 'profileImage' precisa ser o mesmo usado no backend

    try {
        const response = await fetch(`${API_URL}/authen/foto-perfil`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData, // Envia o arquivo como FormData
        });

        const data = await response.json();
        
        // Log da resposta para verificar o que está sendo retornado
        console.log('Dados da resposta:', data);

        if (data.path) {
            return data; // Retorna os dados contendo o path da imagem
        } else {
            throw new Error('Caminho da imagem não encontrado');
        }
    } catch (error) {
        console.error('Erro ao enviar imagem de perfil:', error);
        throw error; // Re-throw para ser capturado no bloco catch do frontend
    }
}


// Função para enviar assinatura
export async function uploadSignature(file) {
    const token = localStorage.getItem('token'); // Supondo que o token JWT esteja armazenado no localStorage
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    const formData = new FormData();
    formData.append('signatureImage', file); // O campo 'signatureImage' precisa ser o mesmo usado no backend
    try {
        const response = await fetch(`${API_URL}/authen/assinatura`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData, // Envia o arquivo como FormData
        });
        const data = await response.json();
        if (data.path) {
            console.log('Assinatura salva com sucesso:', data.path);
            // Atualize a imagem no frontend
            document.getElementById('signaturePreview').src = data.path;
        }
    } catch (error) {
        // Erro
        console.error('Erro ao salvar assinatura:', error.response?.data?.message || error.message);
    }
}
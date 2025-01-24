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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha na requisição.');
        }
        const result = await response.json();
        console.log('Resposta do servidor para registro:', result);
        return { success: true, message: result.message };
    } catch (error) {
        console.error('Erro ao registrar:', error.message);
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
export async function uploadProfileImage(selectedProfileImage) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token não encontrado');
    }
    const formData = new FormData();
    formData.append('profileImage', selectedProfileImage);
    try {
        const response = await fetch(`${API_URL}/authen/foto-perfil`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
        }
        const data = await response.json();
        console.log('Resposta do servidor:', data);
        if (!data.path) {
            throw new Error('Caminho da imagem não retornado pelo servidor');
        }
        return data;
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
    }
}
export async function getFotoPerfil() {
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/authen/usuario/foto-perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        const fotoPerfil = `..${data.fotoPerfil}`;
        // Atualiza a imagem de perfil na interface (substitua "profileImgElement" pelo ID ou classe do elemento HTML)
        // Atualiza as imagens de perfil na interface
        const ids = ['img-perfil', 'profileImage']; // Lista de IDs dos elementos
        if (fotoPerfil) {
            ids.forEach((id) => {
                const element = document.getElementById(id); // Seleciona o elemento pelo ID
                if (element) {
                    element.src = fotoPerfil; // Atualiza a imagem
                }
            });
        }
        return;
    } catch (error) {
        console.error('Erro ao buscar foto do perfil:', error);
        return;
    }
}
// Função para enviar assinatura
export async function uploadSignature(blob) {
    const token = localStorage.getItem('token'); // Supondo que o token JWT esteja armazenado no localStorage
    if (!token) {
        console.error('Token não encontrado.');
        throw new Error('Token não encontrado. Faça login novamente.'); // Lança um erro em vez de apenas retornar
    }
    const formData = new FormData();
    formData.append('assinatura', blob, 'assinatura.png'); // Nome do campo ajustado para 'assinatura' e arquivo com nome adequado
    try {
        const response = await fetch(`${API_URL}/authen/assinatura`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, // Autorização via token
            },
            body: formData, // Envia o arquivo como FormData
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na resposta do servidor:', errorData);
            throw new Error(errorData.message || 'Erro ao processar a solicitação no servidor.');
        }
        const data = await response.json();
        console.log('Resposta do servidor:', data);
        if (!data.path) {
            throw new Error('Caminho da assinatura não retornado pelo servidor.');
        }
        return data; // Retorna os dados da resposta, incluindo o caminho da assinatura
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error; // Propaga o erro para o chamador lidar com ele
    }
}
export async function getAssinatura() {
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/authen/usuario/assinatura`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        const imgAssinatura = data.imgAssinatura;
        if (imgAssinatura === 'useCanvas') {
            const container = document.getElementById('container');
            container.innerHTML = `
                <h1 id="SignatureTittle">Assinatura Digital</h1>
                <p>Registre a sua assinatura digital abaixo.</p>
                <div class="signature-container" id="signature-container">
                    <canvas id="signatureCanvas"></canvas>
                    <div>
                        <button class="btn1" id="limpar">Limpar</button>
                        <button id="saveSignatureImage">Salvar Assinatura</button>
                        <abbr title="Para armazenar sua assinatura, clique em 'Gerar img' e depois em 'Salvar Assinatura'.">
                            <i class="fa-solid fa-info" style="color: #808080;" id="signatureInfo"></i>
                        </abbr>
                    </div>
                </div>`;
        } else {
            const container = document.getElementById('signature-container');
            container.innerHTML = '';
            container.innerHTML = `<img src="${imgAssinatura}" alt="Assinatura" class="assinatura" />`;
            const p = document.querySelector('.container p'); // Seleciona o primeiro <p> dentro da div container
            p.innerText = '';
            return;
        }
    } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        return;
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
export async function requestResetSenhaUsuario(email) {
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
        return { success: true };
    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error.message);
        return { success: false, message: error.message };
    }
}
// Função para solicitar a redefinição de senha
export async function resetSenhaUsuario({ token, novaSenha }) {
    try {
        const response = await fetch(`${API_URL}/authen/reset-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, novaSenha }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao solicitar redefinição de senha.');
        }
        const result = await response.text();
        console.log('Resposta do servidor:', result);
        return { success: true, message: result.message };
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
export async function buscarCursosConcluidos(data1, data2) { //FALTA EDITAR, AINDA NÃO ESTA FUNCIONANDO
    const token = localStorage.getItem('token');
    console.log('buscando datas', { data1, data2 })
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/routes/buscar-por-data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data_inicio: data1, data_fim: data2 })
        });
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { cursos: [] }; // Retorna um array vazio em caso de erro
    }
};
export async function buscarCursosConcluidosPorPesquisa(texto) {
    const token = localStorage.getItem('token');
    console.log('buscando o curso', { texto })
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/routes/buscar-por-pesquisa?q=${texto}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: texto })
        });
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { cursos: [] }; // Retorna um array vazio em caso de erro
    }
};
export async function getCursosConcluidos() { //FALTA EDITAR, AINDA NÃO ESTA FUNCIONANDO
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição
    if (!token) {
        console.error('Token não encontrado.');
        return { message: 'Token não encontrado' }; // Pode redirecionar para login ou fazer outra ação
    }
    try {
        const response = await fetch(`${API_URL}/routes/carregar-cursos-concluidos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { cursos: [] }; // Retorna um array vazio em caso de erro
    }
};
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
/*-------- visualizar kits didáticos ---------------*/
export async function buscarKitsDocente(nome_curso) {
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição
    try {
        const response = await fetch(`${API_URL}/routes/kit-didatico-curso`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome_curso:nome_curso})
        });
        if (response.status === 404) {
            console.warn('Curso não possui kits.');
            return []; // Retorna array vazio em caso de curso sem kits
        }
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        const result = await response.json();
        //console.log(`${result}`);
        return result
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return { message: error.message}; // Retorna um array vazio em caso de erro
    }
}
/*----- Visualizar os materiais inseridos nos kit didáticos-----*/
export async function buscarMateriaisDocente(nome_kit) {
    const token = localStorage.getItem('token');
    // Verificar se o token existe antes de fazer a requisição 
    try {
        const response = await fetch(`${API_URL}/routes/materiais-kit-didatico`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome_kit:nome_kit})
        });
        if (response.status === 404) {
            console.warn('Kit não possui materiais');
            return []; // Retorna array vazio em caso de curso sem kits
        }
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        const result = await response.json();
        //console.log(result);
        return result
    } catch (error) {
        console.error('Erro ao buscar os materiais:', error);
        return { message: error.message}; // Retorna um array vazio em caso de erro
    }
}

//visualizar kits didáticos - coordenação

export async function buscarKitsCoordenacao() {
    const token = localStorage.getItem('token');
    try {
        const response= await fetch(`${API_URL}/routes/buscar-kits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 404) {
            res.send('Nenhum kit encontrado - api')
        }

        if(!response.ok) {
            throw new res.send('Erro no server');
        }

        const resultado = await response.json();
        console.log(resultado)
        return resultado
    } catch(error) {
        console.error('Erro ao buscar os materiais:', error);
        return { message: error.message}; // Retorna um array vazio em caso de erro
    }
}
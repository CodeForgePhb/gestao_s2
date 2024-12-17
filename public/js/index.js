const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const URL = 'http://localhost:3001/api'

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Adiciona um listener para o formulário de registro que intercepta o envio do formulário.
document.querySelector('#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário para o servidor.

    // Obtém os valores inseridos pelo usuário nos campos do formulário.
    const nome_usuario = document.getElementById('nome-reg').value;          // Nome do usuário
    const email = document.getElementById('email-reg').value;        // E-mail do usuário
    const senha = document.getElementById('senha-reg').value;  // Senha escolhida pelo usuário
    const setor = document.getElementById('setor').value;     // setor do usuário

    // Verifica se todos os campos obrigatórios foram preenchidos.
    if (!nome_usuario || !email || !senha || !setor) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Chama a função 'cadastro' (definida no 'api.js') e aguarda o resultado do registro.
    const result = await cadastro(nome_usuario, email, senha, setor);

    // Verifica se o resultado do registro foi bem-sucedido.
    if (result.success) {
        // Exibe uma mensagem de sucesso e instrui o usuário a fazer login.
        alert('Cadastro bem-sucedido! Faça login para continuar.');

        // Reseta o formulário de registro, limpando todos os campos.
        document.getElementById('registrationForm').reset();

        // Redireciona o usuário para a página de login após o registro bem-sucedido.
        window.location.href = 'index.html';
    } else {
        // Exibe uma mensagem de erro se o registro falhar.
        alert('Cadastro falhou! Tente novamente.');
    }
});


// document.querySelector('#loginForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Impede o comportamento padrão de envio do formulário para a página.

//     const email = document.getElementById('email').value;
//     const senha = document.getElementById('senha').value;

//     const result = await login(email, senha);

//     // Verifica se a resposta contém um token.
//     if (result.token) {
//         // Armazena o token JWT no localStorage para uso em futuras requisições autenticadas.
//         localStorage.setItem('token', result.token);

//         // Redireciona o usuário para a página principal após o login bem-sucedido.
//         window.location.href = 'docente.html';
//     } else {
//         // Exibe uma mensagem de erro personalizada se o login falhar.
//         alert(result.message || 'Login falhou! Verifique suas credenciais.');
//     }
// })
document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const result = await login(email, senha);

    if (result.token) {
        console.log('Token recebido do servidor', result.token);
        localStorage.setItem('token', result.token);

        // Busca o setor do usuário
        const setorResult = await buscarSetor(result.token);

        if (setorResult.setor) {
            const setor = setorResult.setor;

            // Redireciona com base no setor
            if (setor === 'docente') {
                window.location.href = 'docente.html';
            } else if (setor === 'coordenação') {
                window.location.href = 'coordenação.html';
            } else if (setor === 'gestão') {
                window.location.href = 'gestão.html';
            } else {
                window.location.href = 'setor_de_compras.html'; // Página padrão
            }
        } else {
            alert(setorResult.message || 'Erro ao obter setor do usuário.');
        }
    } else {
        alert(result.message || 'Login falhou! Verifique suas credenciais.');
    }
});

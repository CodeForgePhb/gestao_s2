import { cadastro, login, buscarSetor, monitorarTokenExpiracao } from '../api.js'; // Ajuste o caminho conforme necessário

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
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
        alert('Cadastro bem-sucedido! Faça login para continuar.');
        document.getElementById('registrationForm').reset();
        window.location.href = 'index.html';
    } else {
        if (result.message === 'Usuário já cadastrado.') {
            alert('Email já cadastrado. Faça login ou recupere sua senha.');
        } else {
            alert('Cadastro falhou! Tente novamente.');
        }
    }
});
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
                window.location.href = 'coordenacao.html';
            } else if (setor === 'gestão') {
                window.location.href = 'gestao.html';
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

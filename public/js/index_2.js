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
    const nome = document.getElementById('nome-reg').value;          // Nome do usuário
    const email = document.getElementById('email-reg').value;        // E-mail do usuário
    const senha = document.getElementById('senha-reg').value;  // Senha escolhida pelo usuário
    const setor = document.getElementById('setor').value;     // Data de nascimento do usuário

 // Verifica se todos os campos obrigatórios foram preenchidos.
 if (!nome || !email || !senha || !setor) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

    // Chama a função 'register' (definida no 'api.js') e aguarda o resultado do registro.
    const result = await register(nome, email, senha, setor );

    // Verifica se o resultado do registro foi bem-sucedido.
    if (result.success) {
        // Exibe uma mensagem de sucesso e instrui o usuário a fazer login.
        alert('Registro bem-sucedido! Faça login para continuar.');

        // Reseta o formulário de registro, limpando todos os campos.
        document.getElementById('registrationForm').reset();

        // Redireciona o usuário para a página de login após o registro bem-sucedido.
        window.location.href = 'login.html';
    } else {
        // Exibe uma mensagem de erro se o registro falhar.
        alert('Registro falhou! Tente novamente.');
    }
});


document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário para a página.

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const result = await login(email, senha);

				// Verifica se a resposta contém um token.
				if (result.token) {
					// Armazena o token JWT no localStorage para uso em futuras requisições autenticadas.
					localStorage.setItem('token', result.token);

					// Redireciona o usuário para a página principal após o login bem-sucedido.
					window.location.href = 'docente.html';
				} else {
					// Exibe uma mensagem de erro personalizada se o login falhar.
					alert(result.message || 'Login falhou! Verifique suas credenciais.');
				}

        // Redirecionar com base no tipo de usuário
        // if (userType === 'docente') {
        //     window.location.href = 'docente.html';
        // } else if (userType === 'coordenação') {
        //     window.location.href = 'coordenação.html';
        // } else if (userType === 'gestão') {
        //     window.location.href = 'gestão.html';
        // } else {
        //     alert('Tipo de usuário desconhecido!');
        // }
        // } else {
        // alert('E-mail ou senha incorretos!');
         
    }
)
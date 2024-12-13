const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});


const loginForm = document.getElementById('loginForm');

document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário para a página.

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const result = await login(email, password);

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
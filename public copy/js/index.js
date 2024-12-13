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

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3001/#?', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    }).then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario)); // Armazena o usuário logado
            atualizarInterfaceUsuarioLogado(); // Atualiza a interface com as informações do usuário logado
        } else {
            alert('Erro ao fazer login');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
    });
})

function atualizarInterfaceUsuarioLogado(){
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (usuarioLogado.setor == "docente") {
        window.location.href = "docente.html"
    }
}

window.onload = function () {
    atualizarInterfaceUsuarioLogado();
};



// if (userType === 'docente') {
//     window.location.href = 'docente.html';
// } else if (userType === 'admin') {
//     window.location.href = 'admin.html';
// } else if (userType === 'aluno') {
//     window.location.href = 'aluno.html';
// } else {
//     alert('Tipo de usuário desconhecido!');
// }





//     if (response.ok) {
//         const data = await response.json();
//         const token = data.token;
//         localStorage.setItem('token', token); // Salvar o token no localStorage
//         window.location.href = 'docente.html'; // Redirecionar para a página do usuário
//     } else {
//         alert('E-mail ou senha incorretos!');
//     }
// });
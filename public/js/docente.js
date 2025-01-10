// Supondo que as funções de API estejam em arquivos separados, você pode importá-las assim:
import { uploadProfileImage, uploadSignature, getCursosVigentes, getCursosConcluidos, getNome, logoutUser, monitorarTokenExpiracao } from '../api.js'; // Ajuste o caminho conforme necessário
window.onload = () => {
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
};
//Função assíncrona para carregar e exibir as transações na tabela.
async function carregarCursosVigentes() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursos = await getCursosVigentes();
    console.log('Cursos Vigentes:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('courses');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (!cursos.cursos || cursos.cursos.length === 0) {
        console.log('Nenhum curso encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course');
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    cursos.cursos.forEach(curso => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course')
        divInterna.innerHTML = `
            <div class="accordion-header">
                <span>${curso.nome_curso}</span><!--Exibe o nome do curso-->
                <span class="arrow">&#9650;</span>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
//------ função de carregamento de cursos 
async function carregarCursosConcluidos() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursos = await getCursosConcluidos();
    console.log('Cursos cursos concluidos:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('content-wrapper');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (!cursos.cursos || cursos.cursos.length === 0) {
        console.log('Nenhum curso encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        divInterna.classList.add('course-item')
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    cursos.cursos.forEach(curso => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `
        <h2 class="course-title">${curso.nome_curso}</h2>
        <p class="course-date">Concluido em ${curso.data_fim}</p>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
//Função assíncrona para carregar e exibir as transações na tabela.
async function carregarNome() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return;
    }
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const nome = await getNome();
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const saudacoes = document.getElementsByClassName('saudacao');
    for (let i = 0; i < saudacoes.length; i++) {
        saudacoes[i].innerText = ''; // Modifica o texto de cada elemento
    }
    //Verificar se a lista de trasações está vazia.
    // if (!nome || nome.length === 0) {
    if (!nome || !nome.nome) {
        console.log('Nenhum nome encontrado.') //Loga se não houver transações
        for (let i = 0; i < saudacoes.length; i++) {
            saudacoes[i].innerText = `Favor faça login`; // Modifica o texto de cada elemento
        }; //Exibir uma mensagem informando que nao há transações
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    const saudacao1 = document.getElementsByClassName('saudacao')[0];
    saudacao1.innerText = `${nome.nome}`; // Limpa o conteúdo de um unico elemento (se fosse id)
    const saudacao2 = document.getElementsByClassName('saudacao')[1];
    saudacao2.innerText = `Olá, ${nome.nome}`; // Limpa o conteúdo de um unico elemento (se fosse id)
}
document.querySelector('#btnLogout').addEventListener('click', async (event) => {
    try {
        await logoutUser(); // Chama a função de logout
        alert('Logout feito com sucesso!')
    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Houve um erro ao tentar deslogar. Tente novamente.');
    }
});
document.addEventListener('DOMContentLoaded', () => {
// Função assíncrona para preview de imagem
async function previewImageAsync(input, previewContainer, width, height) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" width="${width}" height="${height}" />`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
// Seletores dos elementos
const newProfileImage = document.getElementById('newProfileImage');
const saveProfileImage = document.getElementById('saveProfileImage');
const profilePreview = document.querySelector('.fot');
const signatureImage = document.getElementById('signatureImage');
const saveSignatureImage = document.getElementById('saveSignatureImage');
const signaturePreview = document.getElementById('signaturePreview');
// Função assíncrona para alterar a imagem de perfil

newProfileImage.addEventListener('change', async () => {
    await previewImageAsync(newProfileImage, profilePreview, 50, 50);
    // Enviar imagem de perfil ao backend
    const file = newProfileImage.files[0];
    if (file) {
      try {
        const response = await uploadProfileImage(file);
  
        // Verificar se a resposta contém o caminho
        if (response?.path) {
          console.log('Imagem de perfil salva com sucesso:', response.path);
          const profileImageElement = document.querySelector('.profile-image');
  
          if (profileImageElement) {
            profileImageElement.src = response.path; // Atualiza a imagem no frontend
          } else {
            console.error('Elemento de imagem de perfil não encontrado.');
          }
        } else {
          console.error('Caminho da imagem não encontrado na resposta.');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem de perfil:', error);
        alert('Erro ao salvar imagem de perfil.');
      }
    }
  });
  
// Função assíncrona para envio único da assinatura
signatureImage.addEventListener('change', async () => {
    await previewImageAsync(signatureImage, signaturePreview, 100, 50);
    saveSignatureImage.disabled = false;
});
// Função assíncrona para salvar assinatura
saveSignatureImage.addEventListener('click', async () => {
    const file = signatureImage.files[0];
    if (file) {
        try {
            const response = await uploadSignature(file);
            if (response?.path) {
                alert('Assinatura salva com sucesso!');
                signatureImage.disabled = true;
                saveSignatureImage.disabled = true;
            } else {
                alert('Erro ao salvar assinatura.');
            }
        } catch (error) {
            console.error('Erro ao salvar assinatura:', error);
            alert('Erro ao salvar assinatura.');
        }
    }
});
});
//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    carregarCursosVigentes(),
    carregarCursosConcluidos(),
    carregarNome()
});

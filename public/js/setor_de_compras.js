import { getNome, logoutUser, monitorarTokenExpiracao } from '../api.js'; // Ajuste o caminho conforme necessário

window.onload = () => {
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
};


//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    getNome()
});


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
    
}
// Itera sebre a lista de transações e cria uma linha de tabela para cada transação
const saudacao1 = document.getElementsByClassName('saudacao')[0];
saudacao1.innerText = `${nome.nome}`; // Limpa o conteúdo de um unico elemento (se fosse id)
const saudacao2 = document.getElementsByClassName('saudacao')[1];
saudacao2.innerText = `Olá, ${nome.nome}`; // Limpa o conteúdo de um unico elemento (se fosse id)

document.querySelector('#btnLogout').addEventListener('click', async (event) => {
    try {
        await logoutUser(); // Chama a função de logout
        alert('Logout feito com sucesso!')
    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Houve um erro ao tentar deslogar. Tente novamente.');
    }
});

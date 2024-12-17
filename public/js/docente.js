


//Função assíncrona para carregar e exibir as transações na tabela.
async function carregarCursosVigentes() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    console.log('Token armazenado:', token); // Adiciona um log para "verificar"(remover após testes) o token recuperado.

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
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        divInterna.classList.add('course')
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }

    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação

    cursos.cursos.forEach(curso => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course')
        divInterna.innerHTML = `
            <span >${curso.nome_curso}</span><!--Exibe o nome do curso-->
            <span class="arrow">&#9662;</span>
            `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}

 //Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
 document.addEventListener('DOMContentLoaded', carregarCursosVigentes);
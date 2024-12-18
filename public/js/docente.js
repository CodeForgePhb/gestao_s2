// dropdown 
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('.arrow');
  
        if (content.style.display === 'block') {
            content.style.display = 'none';
            arrow.classList.remove('down');
        } else {
            document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
            document.querySelectorAll('.arrow').forEach(a => a.classList.remove('down'));
  
            content.style.display = 'block';
            arrow.classList.add('down');
        }
    });
  });
  
  
  function decreaseValue(button) {
    const input = button.nextElementSibling;
    const value = parseInt(input.value);
    if (value > 0) {
        input.value = value - 1;
    }
  }
  
  function increaseValue(button) {
    const input = button.previousElementSibling;
    input.value = parseInt(input.value) + 1;
  }
  
  function validateValue(input) {
    if (input.value < 0) {
        input.value = 0;
    }
  }
  function deleteRow(button) {
    const row = button.closest('tr'); // Localiza a linha mais próxima do botão clicado
    row.remove(); // Remove a linha
  }
  
  
     // Seleciona elementos do DOM
     const confirmModal = document.getElementById('confirmModal');
     const successModal = document.getElementById('successModal');
     const cancelBtn = document.getElementById('cancelBtn');
     const sendBtn = document.getElementById('sendBtn');
     const okBtn = document.getElementById('okBtn');
     const tabs = document.querySelectorAll('.tab');
     const contents = document.querySelectorAll('.content');
  
     // Função para abrir o modal principal
     function openModal() {
         const kitModal = document.getElementById('kitModal');
         if (kitModal) {
             kitModal.style.display = 'block';
         }
     }
  
     // Fecha o modal principal
     function closeModal() {
         const kitModal = document.getElementById('kitModal');
         if (kitModal) {
             kitModal.style.display = 'none';
         }
     }
  
     // Fecha o modal de confirmação
     cancelBtn.addEventListener('click', () => {
         confirmModal.style.display = 'none';
     });
  
     // Abre o modal de confirmação
     document.getElementById('openModalBtn').addEventListener('click', () => {
         confirmModal.style.display = 'flex';
     });
  
     // Abre o modal de sucesso
     sendBtn.addEventListener('click', () => {
         confirmModal.style.display = 'none';
         successModal.style.display = 'flex';
     });
  
     // Função para ativar uma aba específica
     function activateTab(tabName) {
         // Remove a classe ativa de todas as abas e conteúdos
         tabs.forEach(tab => tab.classList.remove('active'));
         contents.forEach(content => content.classList.remove('active'));
  
         // Adiciona a classe ativa à aba e ao conteúdo correspondente
         const targetTab = document.querySelector(`.tab.${tabName}`);
         const targetContent = document.getElementById(tabName);
  
         if (targetTab && targetContent) {
             targetTab.classList.add('active');
             targetContent.classList.add('active');
         }
     }
  
     // Redireciona para a aba "Status" e fecha todos os modais ao clicar em OK
     okBtn.addEventListener('click', () => {
         successModal.style.display = 'none'; // Fecha o modal de sucesso
         const kitModal = document.getElementById('kitModal');
         if (kitModal) {
             kitModal.style.display = 'none'; // Fecha o modal principal de solicitação
         }
         activateTab('status'); // Ativa a aba "Status" e seu conteúdo
     });
  
     // Gerencia cliques manuais nas abas
     tabs.forEach(tab => {
         tab.addEventListener('click', () => {
             // Remover a classe ativa de todas as abas e conteúdos
             tabs.forEach(t => t.classList.remove('active'));
             contents.forEach(c => c.classList.remove('active'));
  
             // Adicionar a classe ativa ao botão clicado e ao conteúdo correspondente
             tab.classList.add('active');
             const target = document.getElementById(tab.dataset.tab);
             target.classList.add('active');
         });
     });

//FIM DO SCRIPT PARA INTERAÇÕES DA PÁGINA DOCENTE.HTML ----------------------------------------------------

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


document.querySelector('#cursos-concluidos').addEventListener('submit', async (event) => {
    
});

//------ função de carregamento de cursos 

async function carregarCursosConcluidos() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    console.log('Token armazenado:', token); // Adiciona um log para "verificar"(remover após testes) o token recuperado.
    
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

//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('click', carregarCursosVigentes, carregarCursosConcluidos);


//Função assíncrona para carregar e exibir as transações na tabela.
async function carregarNome() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    console.log('Token armazenado:', token); // Adiciona um log para "verificar"(remover após testes) o token recuperado.

    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const nome = await getNome();
    console.log('Nome do usuário:', nome); //Adiciona um log para verificar os dados carregados.

    //Obtém o corpo da tabela onde as transações serão inseridas.
    const saudacao = document.getElementById('saudacao');
    saudacao.innerText = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações

    //Verificar se a lista de trasações está vazia.
    if (!nome || nome.length === 0) {
        console.log('Nenhum nome encontrado.') //Loga se não houver transações
        saudacao.innerText = `Favor faça login`; //Exibir uma mensagem informando que nao há transações
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }

    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    saudacao.innerText = `${nome.nome}`
}



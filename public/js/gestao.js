import {
    getAssinatura, getFotoPerfil, uploadProfileImage, uploadSignature,
    getNome, logoutUser, monitorarTokenExpiracao,
    getSolicitacoesEmAndamentoGestao, dadosSolicitacao, trocaParaCompras,
    buscarSolicitacaoGestaoConcluida
} from '../api.js'; // Ajuste o caminho conforme necessário

window.onload = () => {
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
    getFotoPerfil();
    getAssinatura();
    getNome();
    carregarSolicitacoesEmAndamento();
    buscarSolicitacoesEmAndamentoGestao();
    carregarSolicitacoesGestaoConcluidas();
};
//FOTO PERFIL
document.addEventListener('DOMContentLoaded', async () => {
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
    // Função assíncrona para alterar a imagem de perfil
    // Armazena temporariamente o arquivo selecionado
    let selectedProfileImage = null;
    newProfileImage.addEventListener('change', async () => {
        // Exibe a pré-visualização da imagem
        await previewImageAsync(newProfileImage, profilePreview, 50, 50);
        selectedProfileImage = newProfileImage.files[0]; // Armazena o arquivo selecionado
        console.log('Imagem selecionada:', selectedProfileImage);
    });
    saveProfileImage.addEventListener('click', async () => {
        console.log('Botão de salvar imagem clicado');
        if (selectedProfileImage) {
            try {
                // Adicionar feedback visual
                saveProfileImage.disabled = true;
                saveProfileImage.textContent = 'Salvando...';
                const response = await uploadProfileImage(selectedProfileImage);
                console.log('Resposta completa:', response); // Debug
                if (response && response.path) {
                    // Atualizar todas as imagens de perfil na página
                    const profileImages = document.querySelectorAll('.profile-image');
                    profileImages.forEach(img => {
                        img.src = response.path;
                    });
                    // Atualizar também a prévia no modal
                    const previewImage = document.querySelector('.fot img');
                    if (previewImage) {
                        previewImage.src = response.path;
                    }
                    alert('Imagem de perfil atualizada com sucesso!');
                } else {
                    throw new Error('Caminho da imagem não encontrado na resposta');
                }
            } catch (error) {
                console.error('Erro detalhado:', error);
                alert('Erro ao salvar imagem de perfil: ' + error.message);
            } finally {
                // Restaurar o botão
                saveProfileImage.disabled = false;
                saveProfileImage.textContent = 'Salvar Imagem de Perfil';
            }
        } else {
            alert('Nenhuma imagem foi selecionada.');
        }
    });
});
document.addEventListener('DOMContentLoaded', async () => {
    // Configuração do canvas de assinatura
    const signatureCanvas = new fabric.Canvas('signatureCanvas', {
        width: 500,
        height: 200,
        isDrawingMode: true
    });
    // Personalizar brush da assinatura
    signatureCanvas.freeDrawingBrush.width = 3;
    signatureCanvas.freeDrawingBrush.color = 'black';
    // Função para limpar o canvas de assinatura
    function limparAssinatura() {
        signatureCanvas.clear();
    }
    const limpar = document.getElementById('limpar');
    limpar.addEventListener('click', () => {
        limparAssinatura();
    })
    const saveSignatureImage = document.getElementById('saveSignatureImage');
    // const signatureContainer = document.getElementById('signatureContainer'); // Container do canvas e da prévia da assinatura
    // Função assíncrona para salvar a assinatura
    saveSignatureImage.addEventListener('click', async () => {
        try {
            // Captura a assinatura em formato Blob
            signatureCanvas.getElement().toBlob(async (blob) => {
                if (!blob) {
                    alert('Erro ao capturar a assinatura.');
                    return;
                }
                // Adicionar feedback visual
                saveSignatureImage.disabled = true;
                saveSignatureImage.textContent = 'Salvo';
                const response = await uploadSignature(blob);
                console.log('Resposta completa:', response); // Debug
                if (response?.path) {
                    alert('Assinatura salva com sucesso!');
                    //limparAssinatura(); // Limpa o canvas após salvar
                    signatureCanvas.isDrawingMode = false; // Desabilita o modo de desenho
                    location.reload();
                } else {
                    throw new Error('Erro ao salvar assinatura: Caminho da assinatura não retornado.');
                }
            }, 'image/png'); // Converte o canvas para PNG
        } catch (error) {
            console.error('Erro ao salvar assinatura:', error);
            alert(error.message || 'Erro ao salvar assinatura.');
            saveSignatureImage.disabled = false; // Reativa o botão apenas em caso de erro
            saveSignatureImage.textContent = 'Salvar Assinatura';
        }
    });
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
// função para ajustar nome de usuário
function transformarNome(nome) {
    return nome.split(" ")
}
function ajustandoNome(nomes) {
    let nomeAjustado = ""

    nomes.forEach(nome => {
        if (nome.length > 3) {
            nomeAjustado += `${nome[0].toUpperCase()}${nome.substring(1)} `
        } else {
            nomeAjustado += nome + " "
        }
    });
    return nomeAjustado.substring(0, nomeAjustado.length - 1)
}

// Itera sebre a lista de transações e cria uma linha de tabela para cada transação
const saudacao1 = document.getElementsByClassName('saudacao')[0];
saudacao1.innerText = `${ajustandoNome(transformarNome(nome.nome))}`; // Limpa o conteúdo de um unico elemento (se fosse id)
const saudacao2 = document.getElementsByClassName('saudacao')[1];
saudacao2.innerText = `Olá, ${ajustandoNome(transformarNome(nome.nome))}`; // Limpa o conteúdo de um unico elemento (se fosse id)
//LOGOUT
document.querySelector('#btnLogout').addEventListener('click', async (event) => {
    try {
        await logoutUser(); // Chama a função de logout
        alert('Logout feito com sucesso!')
    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Houve um erro ao tentar deslogar. Tente novamente.');
    }
});

//GET DE SOLICITAÇOES EM ANDAMENTO
async function carregarSolicitacoesEmAndamento() {
    const contentStatus = document.querySelector('#solicitacoes');
    const solicitacoesEmAndamento = await getSolicitacoesEmAndamentoGestao();
    //console.log('Dados recebidos:', solicitacoesEmAndamento); // Loga os dados recebidos
    //console.log('É um array?', Array.isArray(solicitacoesEmAndamento)); // Confirma se é um array
    //console.log('Tamanho do array:', solicitacoesEmAndamento.length); // Verifica o tamanho do array
    //
    if (!Array.isArray(solicitacoesEmAndamento) || solicitacoesEmAndamento.length === 0) {
        console.log('Nenhuma solicitação encontrada.'); // Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('solicitacao');
        divInterna.innerHTML = `<span>Nenhuma solicitação encontrada.</span>`; // Exibir uma mensagem informando que não há transações
        contentStatus.appendChild(divInterna); // Adiciona a linha na tabela
        return; // Sai da função, já que não há transações a serem exibidas
    }
    // Itera sobre a lista de solicitações e cria uma linha de dados para cada solicitação
    solicitacoesEmAndamento.forEach(solAndam => {
        const divInterna = document.createElement('div'); // Criar uma nova linha
        divInterna.classList.add('solicitacao');
        divInterna.innerHTML = `
            <div class="accordion-header">              
                <span id="num-sol">${solAndam.numero_solicitacao}</span>
                <span id="nivel-sol">Setor: ${solAndam.setor_atual}</span>
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Cód Produto</strong> ${solAndam.cod_produto}</span>
                    <span><strong>Descrição</strong> ${solAndam.descricao}</span>
                    <span><strong>Unid de Medida</strong> ${solAndam.unidade_medida}</span>
                    <span><strong>Qnt Requerida</strong> ${solAndam.qnt_requerida}</span>
                </div>
                <button onclick="openModal()" type="submit" class="curso_nome" value="${solAndam.id}" id="${solAndam.numero_solicitacao}">Responder Solicitação</button>
            </div>
        `;
        contentStatus.appendChild(divInterna); // Adiciona à tabela
    });
    // Adiciona funcionalidade de accordion
    document.querySelectorAll('.solicitacao').forEach(solicitacao => {
        solicitacao.addEventListener('click', () => {
            const content = solicitacao.querySelector('.accordion-content');
            const arrowIcon = solicitacao.querySelector('.arrow i'); // Seleciona o <i>
            if (content.classList.contains('show')) {
                content.classList.remove('show'); // Fecha
                arrowIcon.style.transform = 'rotate(0deg)'; // Volta ao estado original
            } else {
                content.classList.add('show'); // Abre
                arrowIcon.style.transform = 'rotate(180deg)'; // Rotaciona
            }
        });
    });
}
//SOLICITAÇÔES JÁ RESPONDIDAS DE COMPRAS PARTE DE CONCLUIDAS ABAIXO DE EM ANDAMENTO
async function carregarSolicitacoesGestaoConcluidas() {
    const solicDocenteConc = await buscarSolicitacaoGestaoConcluida();
    console.log('Tipo do dado recebido:', typeof solicDocenteConc);
    console.log('Conteúdo do dado recebido:', solicDocenteConc);

    console.log('Dados recebidos:', solicDocenteConc); // Loga os dados recebidos
    console.log('É um array?', Array.isArray(solicDocenteConc)); // Confirma se é um array
    console.log('Tamanho do array:', solicDocenteConc.length); // Verifica o tamanho do array
    const div = document.getElementById('content-wrapper');
    div.innerHTML = ''; // Limpa o conteúdo antes de adicionar as novas transações
    // Verificar se o array está vazio
    if (!Array.isArray(solicDocenteConc) || solicDocenteConc.length === 0) {
        console.log('Nenhuma solicitação concluída.'); // Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `<span>Nenhuma solicitação concluída.</span>`; // Exibir uma mensagem informando que não há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela
        return; // Sai da função, já que não há transações a serem exibidas
    }
    // Itera sobre a lista de solicitações e cria uma linha de dados para cada solicitação
    solicDocenteConc.forEach(solDocConc => {
        const divInterna = document.createElement('div'); // Criar uma nova linha
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `
            <h2 class="course-title">${solDocConc.numero_solicitacao}</h2>
            <span class="course-date"><strong>Setor Atual: ${solDocConc.setor_atual}</strong></span>
            <span class="course-date"><strong>Status: ${solDocConc.status}</strong></span>
        `;
        div.appendChild(divInterna); // Adiciona à tabela
    });
}
//DADOS PARA A TABELA PRA RESPONDER SOLICITAÇÃO
async function buscarSolicitacoesEmAndamentoGestao() {
    const cod_curso = '1';
    const dadosCursoArray = await dadosSolicitacao(cod_curso);
    // Extrai o primeiro elemento do array (esperando que a API sempre retorne uma lista)
    const dadosCurso = dadosCursoArray[0];
    console.log("Dados do curso:", dadosCurso);
    // Formata as datas para exibição
    const dataInicio = new Date(dadosCurso.data_inicio).toLocaleDateString('pt-BR');
    const dataFim = new Date(dadosCurso.data_fim).toLocaleDateString('pt-BR');
    // Renderiza os dados no frontend
    const info = document.getElementById('info');
    info.innerHTML = `
                    <div>
                        <div><b>Cód Curso:</b> ${dadosCurso.cod}</div>
                        <div><b>Curso:</b> ${dadosCurso.nome}</div>
                        <div><b>Turno:</b> ${dadosCurso.turno}</div>
                        <div><b>Período:</b> ${dataInicio} à ${dataFim}</div>
                        <div><b>Modalidade:</b> ${dadosCurso.modalidade}</div>
                    </div>
                    <div>
                        <div><b>Financiamento:</b><p> ${dadosCurso.financiamento}</p></div>
                        <div><b>Docente:</b> ${dadosCurso.docente}</div>
                        <div><b>CH Total:</b> ${dadosCurso.ch_total} horas</div>
                        <div><b>Matrículas previstas:</b> ${dadosCurso.matriculas_previstas}</div>
                        <div><b>Localidade:</b> ${dadosCurso.localidade}</div>
                    </div>`
    const bodyTable = document.getElementById('body-table');
    const docentesoli = await getSolicitacoesEmAndamentoGestao();
    console.log(docentesoli);
    document.getElementById('name-kit').innerText = `Kit de Periféricos`;
    const numerosSolicitacao = docentesoli.map(item => item.numero_solicitacao).join(', ');
    document.getElementById('num-solic').innerText = `Número de solicitações: ${numerosSolicitacao}`;
    function preencherTabela(docentesoli) {
        bodyTable.innerHTML = '';
        docentesoli.forEach(docsoli => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class="cod_produto">${docsoli.cod_produto}</td>
            <td class="descricao">${docsoli.descricao}</td>
            <td class="qnt_max">${docsoli.qnt_max}</td>
            <td class="unidade_medida">${docsoli.unidade_medida}</td>
            <td class="saldo">${docsoli.saldo}</td>
            <td class="qnt-req">${docsoli.qnt_requerida}</td>`;
            bodyTable.appendChild(row);
        });
    }
    preencherTabela(docentesoli);
    document.getElementById('openModalBtn').addEventListener('click', async () => {
        //aqui
        const trocarDado = await trocaParaCompras();
        console.log(trocarDado);
        alert(`Solicitação respondida com sucesso!`);
        window.location.reload(); // Recarrega a página para evitar estados inconsistentes
    });
}

//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    carregarSolicitacoes(),
        buscarSolicitacoesEmAndamentoGestao(),
        carregarSolicitacoesEmAndamento(),
        carregarSolicitacoesGestaoConcluidas()
});

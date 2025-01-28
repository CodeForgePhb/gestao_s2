// Supondo que as funções de API estejam em arquivos separados, você pode importá-las assim:
import {
    getAssinatura, getFotoPerfil, uploadProfileImage, uploadSignature, getCursosVigentes, buscarCursosConcluidos,
    getCursosConcluidos, buscarCursosConcluidosPorPesquisa, buscarMateriaisDocente, getNome, logoutUser, monitorarTokenExpiracao,
    buscarKitsDocente, postSolicitacao, dadosSolicitacao, buscarSolicitacaoDocente, buscarSolicitacaoDocenteConcluida
} from '../api.js'; // Ajuste o caminho conforme necessário
window.onload = () => {
    carregarSolicitacoesDocente()
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
    getFotoPerfil();
    getAssinatura();
    carregarCursosVigentes();
    buscarSolicitacaoDocente();
};
// Função para obter nome do "User"
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
}
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
//FOTO PERFIL
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
document.addEventListener('DOMContentLoaded', () => {
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
document.getElementById('buscar-cursos-concluidos').addEventListener('submit', async (event) => {
    event.preventDefault();
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const date1 = document.getElementById('date1').value;
    const date2 = document.getElementById('date2').value;
    const cursos = await buscarCursosConcluidos(date1, date2);
    console.log('Cursos concluidos:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('cursos-concluidos');
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
        <span>Professor: ${curso.docente}</span>
        <p class="course-date">Concluido em ${curso.data_fim.substring(0, 10)}</p>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
})
// função para pesquisar cursos concluidos;
document.getElementById('busca-por-cursos-concluidos').addEventListener('keyup', async () => {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursoBuscado = document.getElementById('busca-por-cursos-concluidos').value
    const cursos = await buscarCursosConcluidosPorPesquisa(cursoBuscado);
    console.log('Cursos concluidos:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('cursos-concluidos');
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
        <span>Professor: ${curso.docente}</span>
        <p class="course-date">Concluido em ${curso.data_fim.substring(0, 10)}</p>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
})
//Função assíncrona para carregar e exibir as transações na tabela.
async function carregarCursosVigentes() {
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursos = await getCursosVigentes();
    //console.log('Cursos Vigentes:', cursos); //Adiciona um log para verificar os dados carregados.
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
        divInterna.classList.add('course');
        divInterna.innerHTML = `
            <div class="accordion-header">
                <span id="nome-curso">${curso.nome}</span><!--Exibe o nome do curso-->
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Data Inicio:</strong> ${curso.data_inicio.substring(0, 10)}</span>
                    <span><strong>Data Fim:</strong> ${curso.data_fim.substring(0, 10)}</span>
                    <span><strong>Carga Horária:</strong>${curso.ch_total}</span>
                </div>
                <div class="inf">
                    <span><strong>Cód:</strong>${curso.cod}</span>
                    <span><strong>Turno:</strong>${curso.turno}</span>
                    <span><strong>Turma:</strong>${curso.turma}</span>
                </div>
                <button onclick="openModal()" type="submit" class="curso_nome" value="${curso.cod}" id="${curso.nome}">Abrir Solicitação</button>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
    document.querySelectorAll('.course').forEach(course => {
        course.addEventListener('click', () => {
            const content = course.querySelector('.accordion-content');
            const arrowIcon = course.querySelector('.arrow i'); // Selecione o <i>
            if (content.classList.contains('show')) {
                content.classList.remove('show'); // Fecha
                arrowIcon.style.transform = 'rotate(0deg)'; // Volta ao estado original
            } else {
                content.classList.add('show'); // Abre
                arrowIcon.style.transform = 'rotate(180deg)'; // Rotaciona
            }
        });
    });
    document.querySelectorAll('.curso_nome').forEach(nome => {
        nome.addEventListener('click', async (event) => {
            if (event.target.tagName === "BUTTON") {
                const nome_curso = event.target.id;
                const cod_curso = event.target.value;
                console.log(`Curso clicado: ${nome_curso} Cod curso: ${cod_curso}`);
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
                    <div><b>Financiamento:</b><s ${dadosCurso.financiamento}</div>
                    <div><b>Docente:</b> ${dadosCurso.docente}</div>
                    <div><b>CH Total:</b> ${dadosCurso.ch_total} horas</div>
                    <div><b>Matrículas previstas:</b> ${dadosCurso.matriculas_previstas}</div>
                    <div><b>Localidade:</b> ${dadosCurso.localidade}</div>
                </div>`
                const kits = await buscarKitsDocente(nome_curso);
                const select = document.getElementById('selecao');
                select.innerHTML = ''; // Limpa as opções anteriores
                // Adiciona uma opção padrão
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = kits.length === 0
                    ? 'Não há kits disponíveis'
                    : 'Selecione um kit';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);
                // Adiciona opções de kits (se houver)
                kits.forEach(kit => {
                    const option = document.createElement('option');
                    option.textContent = kit.nome_kit;
                    option.value = kit.nome_kit;
                    select.appendChild(option);
                });
                //console.log(kits.length === 0 ? 'Nenhum kit encontrado.' : 'Kits renderizados com sucesso!');
            }
        });
    });
    const select = document.getElementById('selecao'); // Obtém o novo seletor
    const bodyTable = document.getElementById('body-table');
    const nameKit = document.getElementById('name-kit');
    select.addEventListener('change', async (event) => {
        event.stopImmediatePropagation(); // Impede eventos duplicados
        console.log('Evento change disparado'); // Verifica se o evento está disparando mais de uma vez
        const nome_kit = event.target.value; // Captura o valor selecionado
        if (nome_kit) {
            console.log(`Kit selecionado: ${nome_kit}`);
            const materiais = await buscarMateriaisDocente(nome_kit);
            console.log('Materiais recebidos:', materiais); // Verifica se os dados estão vindo corretamente
            function preencherTabela(materiais) {
                console.log('Preenchendo tabela...'); // Verifica se essa função é chamada mais de uma vez
                nameKit.innerText = `${nome_kit}`;
                bodyTable.innerHTML = '';
                materiais.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td class="cod_produto">${material.cod_produto}</td>
                <td class="descricao">${material.descricao}</td>
                <td class="qnt_max">${material.qnt_max}</td>
                <td class="unidade_medida">${material.unidade_medida}</td>
                <td class="saldo">${material.saldo}</td>
                <td>
                    <button onclick="decreaseValue(this)" class="btn-cont">-</button>
                    <input type="number" value="0" class="qnt_requerida" min="0" style="width: 40px; text-align: center;" onchange="validateValue(this)">
                    <button class="add" onclick="increaseValue(this)">+</button>
                    <button class="delete" onclick="deleteRow(this)">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>`;
                    bodyTable.appendChild(row);
                });
            }
            preencherTabela(materiais);
            console.log('Linhas da tabela preenchidas:', bodyTable.querySelectorAll('tr')); // Verifica se as linhas estão sendo inseridas
        }
    });
    const openModalBtn = document.getElementById('openModalBtn');
    function handleOpenModal(event) {
        event.stopImmediatePropagation(); // Impede que o evento seja disparado múltiplas vezes
        const rows = bodyTable.querySelectorAll('tr'); // Captura todas as linhas da tabela
        console.log('Linhas da tabela:', rows);
        const solicitacoes = Array.from(rows).map(row => {
            const cod_produto = row.querySelector('.cod_produto')?.innerText || "";
            const descricao = row.querySelector('.descricao')?.innerText || "";
            const qnt_max = parseInt(row.querySelector('.qnt_max')?.innerText || 0, 10);
            const unidade_medida = row.querySelector('.unidade_medida')?.innerText || "";
            const saldo = parseInt(row.querySelector('.saldo')?.innerText || 0, 10);
            const qnt_requerida = parseInt(row.querySelector('.qnt_requerida')?.value || 0, 10);
            console.log('Solicitação extraída:', {
                cod_produto,
                descricao,
                qnt_max,
                unidade_medida,
                saldo,
                qnt_requerida
            });
            return { cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida };
        });
        console.log('Solicitações:', solicitacoes);
        // Verifica se há solicitações antes de enviar
        if (solicitacoes.length > 0) {
            postSolicitacao(solicitacoes)
                .then(result => {
                    console.log('Resposta da API:', result);
                    document.getElementById('kit-Modal').style.display = 'none';
                    bodyTable.innerHTML = ''; // Limpa a tabela após o envio
                    window.location.reload(); // Recarrega a página para evitar estados inconsistentes
                })
                .catch(error => {
                    console.error('Erro ao enviar as solicitações:', error);
                    if (error.response && error.response.status === 409) {
                        alert('Solicitação já enviada.');
                    }
                });
        } else {
            console.log("Nenhuma solicitação para enviar.");
        }
    }
    // Removendo evento duplicado antes de adicionar
    openModalBtn.removeEventListener('click', handleOpenModal);
    openModalBtn.addEventListener('click', handleOpenModal, { once: true }); // Garantindo que só será chamado uma vez
}
//=-=-=-=-=-=-=-= Funsão para carregar CURSOS CONLUÍDOS -=-=--=-=-=-=-=--=-=-=
async function carregarCursosConcluidos() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token JWT não encontrado no localStorage")
    }
    const cursos = await getCursosConcluidos();
    //console.log('Cursos concluidos:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('cursos-concluidos');
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
        <span>Professor: ${curso.docente}</span>
        <p class="course-date">Concluido em ${curso.data_fim.substring(0, 10)}</p>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
//GET PARA SOLICITAÇÕES EM ANDAMENTO
async function carregarSolicitacoesDocente() {
    const solicDocente = await buscarSolicitacaoDocente();
    //console.log('Dados recebidos:', solicDocente); // Loga os dados recebidos
    //console.log('É um array?', Array.isArray(solicDocente)); // Confirma se é um array
    //console.log('Tamanho do array:', solicDocente.length); // Verifica o tamanho do array
    const div = document.getElementById('sol-docente');
    div.innerHTML = ''; // Limpa o conteúdo antes de adicionar as novas transações
    // Verificar se o array está vazio
    if (!Array.isArray(solicDocente) || solicDocente.length === 0) {
        console.log('Nenhuma solicitação encontrada.'); // Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('solicitacao');
        divInterna.innerHTML = `<span>Nenhuma solicitação encontrada.</span>`; // Exibir uma mensagem informando que não há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela
        return; // Sai da função, já que não há transações a serem exibidas
    }
    // Itera sobre a lista de solicitações e cria uma linha de dados para cada solicitação
    solicDocente.forEach(solDoc => {
        const divInterna = document.createElement('div'); // Criar uma nova linha
        divInterna.classList.add('solicitacao');
        divInterna.innerHTML = `
            <div class="accordion-header">              
                <span id="num-sol">${solDoc.numero_solicitacao}</span>
                <span id="nivel-sol">Setor: ${solDoc.setor_atual}</span>
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Cód Produto</strong> ${solDoc.cod_produto}</span>
                    <span><strong>Descrição</strong> ${solDoc.descricao}</span>
                    <span><strong>Unid de Medida</strong> ${solDoc.unidade_medida}</span>
                    <span><strong>Qnt Requerida</strong> ${solDoc.qnt_requerida}</span>
                </div>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona à tabela
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
async function carregarSolicitacoesDocenteConcluidas() {
    const solicDocenteConc = await buscarSolicitacaoDocenteConcluida();
    //console.log('Dados recebidos:', solicDocenteConc); // Loga os dados recebidos
    //console.log('É um array?', Array.isArray(solicDocenteConc)); // Confirma se é um array
    //console.log('Tamanho do array:', solicDocenteConc.length); // Verifica o tamanho do array
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
            <p class="course-date"> <strong>Concluído<i class="fa-solid fa-check"></i></strong></p>
        `;
        div.appendChild(divInterna); // Adiciona à tabela
    });
}
//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    carregarCursosVigentes(),
        carregarCursosConcluidos(),
        carregarNome(),
        buscarSolicitacaoDocente(),
        carregarSolicitacoesDocenteConcluidas()
});

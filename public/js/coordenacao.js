import {
    uploadProfileImage, uploadSignature, getFotoPerfil, getAssinatura, getNome,
    logoutUser, monitorarTokenExpiracao, buscarKitsCoordenacao, buscarDocentesCoordenacao,
    buscarCursosCoordenacao, postDocente, postCurso, postKit, postMaterial,
    getSolicitacoesEmAndamento, getSolicitacoesEncaminhadas, dadosSolicitacao,
    trocaParaGestao
} from '../api.js'; // Ajuste o caminho conforme necessário
window.onload = () => {
    getFotoPerfil();
    getAssinatura();
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
    buscarKitsCoordenacao();
    buscarCursosCoordenacao();
    buscarDocentesCoordenacao()
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
async function carregarKitsCoordenacao() {
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const kitsCoord = await buscarKitsCoordenacao();
    //console.log('Kits:', kitsCoord); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('kitsReg');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (kitsCoord.length === 0) {
        console.log('Nenhum kit encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course');
        divInterna.innerHTML = `<span>Nenhum kit encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    kitsCoord.forEach(kitCoord => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course');
        divInterna.innerHTML = `
            <div class="accordion-header">                
            <span id="cod-kit">${kitCoord.cod_kit}</span>
                <span id="nome-kit">${kitCoord.nome_kit}</span><!--Exibe o nome do curso-->
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Tipo:</strong> ${kitCoord.tipo}</span>
                    <span><strong>Curso Vinculado:</strong> ${kitCoord.curso}</span>
                </div>
                <button type="submit" class="editar_kit" id="${kitCoord.cod_kit}">Editar Kit</button>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
async function carregarDocentesCoordenacao() {
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const docenCoord = await buscarDocentesCoordenacao();
    //console.log('Docentes:', docenCoord); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('docentesReg');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (docenCoord.length === 0) {
        console.log('Nenhum docente encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course');
        divInterna.innerHTML = `<span>Nenhum docente encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    docenCoord.forEach(docCoord => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course');
        divInterna.innerHTML = `
            <div class="accordion-header">              
            <span id="matricula-doc">${docCoord.matricula}</span>
                <span id="nome-doc">${docCoord.nome}</span><!--Exibe o nome do curso-->
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Email</strong> ${docCoord.email}</span>
                    <span><strong>Telefone</strong> ${docCoord.telefone}</span>
                </div>
                <button type="submit" class="editar_doc" id="${docCoord.matricula}">Editar Docente</button>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
async function carregarCursosCoordenacao() {
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursosCoord = await buscarCursosCoordenacao();
    //console.log('Cursos:', cursosCoord); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('cursosReg');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (cursosCoord.length === 0) {
        console.log('Nenhum curso encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course');
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    cursosCoord.forEach(curCoord => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course');
        divInterna.innerHTML = `
            <div class="accordion-header">            
            <span id="cod-curso">${curCoord.cod}</span>
                <span id="nome-curso">${curCoord.nome}</span><!--Exibe o nome do curso-->
                <span class="arrow"><i class="fa-solid fa-chevron-down" style="color: #808080;"></i></span>
            </div>
            <div class="accordion-content">
                <div class="inf">
                    <span><strong>Data Inicio:</strong> ${curCoord.data_inicio.substring(0, 10)}</span>
                    <span><strong>Data Fim:</strong> ${curCoord.data_fim.substring(0, 10)}</span>
                    <span><strong>Carga Horária:</strong>${curCoord.ch_total}</span>
                    <span><strong>Modalidade:</strong>${curCoord.modalidade}</span>
                    <span><strong>Localidade:</strong>${curCoord.localidade}</span>
                </div>
                <div class="inf">
                    <span><strong>Matrículas Previstas:</strong>${curCoord.matriculas_previstas}</span>
                    <span><strong>Turno:</strong>${curCoord.turno}</span>
                    <span><strong>Turma:</strong>${curCoord.turma}</span>
                    <span><strong>Financiamento:</strong>${curCoord.financiamento}</span>
                    <span><strong>Docente:</strong>${curCoord.docente}</span>
                </div>
                <button type="submit" class="editar_curso" id="${curCoord.cod}">Editar Curso</button>
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
}
const cancelarBotoes = document.querySelectorAll('.canc');
cancelarBotoes.forEach((botao) => {
    botao.addEventListener('click', (event) => {
        // Encontra o formulário mais próximo com a classe 'form-reg'
        const form = event.target.closest('.form-reg');
        form.reset();
    });
});
document.getElementById('form-docente').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Captura os valores dos inputs
    const matricula = document.getElementById('matricula-doc').value;
    const nome = document.getElementById('nome-doc').value;
    const email = document.getElementById('email-doc').value;
    const telefone = document.getElementById('telefone-doc').value;
    // Chama a função postDocente e aguarda o resultado
    const response = await postDocente(matricula, nome, email, telefone);
    // Trata a resposta
    if (response.message) {
        console.log(response.message);
        alert('Docente cadastrado com sucesso!');
        event.target.reset();
    }
});
document.getElementById('form-curso').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Captura os valores dos inputs
    const cod = document.getElementById('cod-cur').value;
    const nome = document.getElementById('nome-cur').value;
    const financiamento = document.getElementById('finan-cur').value;
    const modalidade = document.getElementById('modali-cur').value;
    const data_inicio = document.getElementById('inicio-cur').value;
    const data_fim = document.getElementById('fim-cur').value;
    const localidade = document.getElementById('locali-cur').value;
    const turno = document.getElementById('turno-cur').value;
    const turma = document.getElementById('turma-cur').value;
    const ch_total = document.getElementById('ch-cur').value;
    const matriculas_previstas = document.getElementById('mat-prev-cur').value;
    const docenteSelect = document.getElementById('docente-select');
    const docente = docenteSelect.options[docenteSelect.selectedIndex].text;
    // Chama a função postDocente e aguarda o resultado
    const response = await postCurso(nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim, cod, docente);
    // Trata a resposta
    if (response.message) {
        console.log(response.message);
        alert('Curso cadastrado com sucesso!');
        event.target.reset();
    }
});
document.getElementById('form-kit').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Captura os valores dos inputs
    const cod_kit = document.getElementById('cod-kit').value;
    const nome_kit = document.getElementById('nome-kit').value;
    const tipo = document.getElementById('tipo-kit').value;
    const cursoSelect = document.getElementById('curso-select');
    const curso = cursoSelect.options[cursoSelect.selectedIndex].text;
    // Chama a função postDocente e aguarda o resultado
    const response = await postKit(cod_kit, nome_kit, tipo, curso);
    // Trata a resposta
    if (response.message) {
        console.log(response.message);
        alert('Kit cadastrado com sucesso!');
        event.target.reset();
    }
});
document.getElementById('form-material').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Captura os valores dos inputs
    const cod_produto = document.getElementById('cod-material').value;
    const descricao = document.getElementById('desc-material').value;
    const qnt_max = document.getElementById('qnt-max').value;
    const unidade_medida = document.getElementById('unidade-medida').value;
    const saldo = document.getElementById('saldo').value;
    const codSelect = document.getElementById('codigo-kit-select');
    const cod_kit = codSelect.options[codSelect.selectedIndex].text;
    const nomeSelect = document.getElementById('nome-kit-select');
    const nome_kit = nomeSelect.options[nomeSelect.selectedIndex].text;
    // Chama a função postDocente e aguarda o resultado
    const response = await postMaterial(cod_produto, descricao, qnt_max, unidade_medida, saldo, cod_kit, nome_kit);
    // Trata a resposta
    if (response.message) {
        console.log(response.message);
        alert('Material cadastrado com sucesso!');
        event.target.reset();
    }
});
// função para renderizar todas as solicitações
async function carregarSolicitacoesEmAndamento() {
    const contentStatus = document.querySelector('#solicitacoes');
    const solicitacoesEmAndamento = await getSolicitacoesEmAndamento();
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
// função para renderizar as solicitações encaminhadas
async function carregarSolicitacoesEncaminhadas() {
    const coursesEncaminhados = document.getElementById('encaminhados');
    const solicitacoesEncaminhadas = await getSolicitacoesEncaminhadas();
    console.log('Dados recebidos:', solicitacoesEncaminhadas); // Loga os dados recebidos
    console.log('É um array?', Array.isArray(solicitacoesEncaminhadas)); // Confirma se é um array
    console.log('Tamanho do array:', solicitacoesEncaminhadas.length); // Verifica o tamanho do array
    const div = document.getElementById('encaminhados');
    div.innerHTML = ''; // Limpa o conteúdo antes de adicionar as novas transações
    // Verificar se o array está vazio
    if (!Array.isArray(solicitacoesEncaminhadas) || solicitacoesEncaminhadas.length === 0) {
        console.log('Nenhuma solicitação concluída.'); // Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `<span>Nenhuma solicitação concluída.</span>`; // Exibir uma mensagem informando que não há transações
        coursesEncaminhados.appendChild(divInterna); // Adiciona a linha na tabela
        return; // Sai da função, já que não há transações a serem exibidas
    }
    // Itera sobre a lista de solicitações e cria uma linha de dados para cada solicitação
    solicitacoesEncaminhadas.forEach(solEncam => {
        const divInterna = document.createElement('div'); // Criar uma nova linha
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `
            <h2 class="course-title">${solEncam.numero_solicitacao}</h2>
            <p class="course-date"><strong>${solEncam.setor_atual}<i class="fa-solid fa-check"></i></strong></p>
            <p class="course-date"><strong>${solEncam.status}<i class="fa-solid fa-check"></i></strong></p>
        `;
        coursesEncaminhados.appendChild(divInterna); // Adiciona à tabela
    });
}

async function carregarSolicitacoesdoDocente() {
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
    const docentesoli = await getSolicitacoesEmAndamento();
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
        const trocarDado = await trocaParaGestao();
        console.log(trocarDado);
        alert(`Solicitação respondida com sucesso!`);
        window.location.reload(); // Recarrega a página para evitar estados inconsistentes

    });
}
//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    carregarNome(),
        carregarKitsCoordenacao(),
        carregarCursosCoordenacao(),
        carregarDocentesCoordenacao(),
        carregarSolicitacoesEmAndamento(),
        carregarSolicitacoesEncaminhadas(),
        carregarSolicitacoesdoDocente()
});
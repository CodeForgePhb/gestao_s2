import {
    dadosSolicitacao, getSolicitacoesConcluidasCompras, getAssinaturas
} from '../api.js'; // Ajuste o caminho conforme necessário

window.onload = () => {
    buscarSolicitacoesPrint();
    displaySignatures();
};

//DADOS PARA A TABELA PRA RESPONDER SOLICITAÇÃO
async function buscarSolicitacoesPrint() {
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
    const docentesoli = await getSolicitacoesConcluidasCompras();
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
}
async function displaySignatures() {
    const container = document.getElementById('signature-container');

    try {
        const signatures = await getAssinaturas();

        if (signatures.message) {
            container.innerHTML = `<p>${signatures.message}</p>`;
            return;
        }

        // Limpar o container antes de preencher
        container.innerHTML = '';

        // Criar os elementos para exibir as assinaturas
        signatures.forEach(item => {
            const card = document.createElement('div');
            card.className = 'signature-card';

            const role = document.createElement('h3');
            role.textContent = item.setor.charAt(0).toUpperCase() + item.setor.slice(1);

            const img = document.createElement('img');
            img.src = `http://localhost:3001${item.signature_image}`;
            img.alt = `${item.setor} signature`;

            card.appendChild(role);
            card.appendChild(img);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao exibir assinaturas:', error);
        container.innerHTML = '<p>Erro ao carregar assinaturas. Tente novamente mais tarde.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarSolicitacoesPrint(),
    buscarAssinaturasPrint(),
    displaySignatures()
});
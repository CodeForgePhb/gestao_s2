import db from '../config/db.js';
//GET
export const buscarCursosCompras = async (req, res) => {
    try {
        // Obter todos os números de solicitação
        const [numerosSolicitacao] = await db.query(`SELECT numero_solicitacao FROM solicitacoes`);
        // Se não houver números de solicitação
        if (numerosSolicitacao.length === 0) {
            return res.status(404).send('Nenhum número de solicitação encontrado');
        }
        // Inicializar um array para armazenar os números de produto extraídos
        const numerosProduto = [];
        // Extrair os números de produto de cada número de solicitação
        numerosSolicitacao.forEach(solicitacao => {
            const numeroSolicitacao = solicitacao.numero_solicitacao;
            const partes = numeroSolicitacao.split('-');
            const numeroProduto = partes.slice(3).join('-'); // Pega tudo após o 3º hífen
            numerosProduto.push(numeroProduto);
        });
        // Filtrar números repetidos
        const numerosProdutoUnicos = numerosProduto.filter((value, index, self) => self.indexOf(value) === index);
        console.log(numerosProdutoUnicos)
        // Inicializar um array para armazenar os cursos encontrados
        const cursos = [];
        // Para cada número único de produto, buscar o curso correspondente
        for (let numeroProduto of numerosProdutoUnicos) {
            // Buscar o curso baseado no número do produto
            const [curso] = await db.query(`
                SELECT k.curso
                FROM materiais m
                JOIN kit k ON m.cod_kit = k.cod_kit
                WHERE m.cod_produto = ?;
            `, [numeroProduto]);
            // Se o curso for encontrado, adicionar ao array de cursos
            if (curso && curso.length > 0) {
                cursos.push(curso[0].curso);
            } else {
                // Se o curso não for encontrado, adicionar um aviso de não encontrado
                cursos.push(`Curso não encontrado para o número do produto: ${numeroProduto}`);
            }
        }
        // Se não houver cursos, retornar resposta apropriada
        if (cursos.length === 0) {
            return res.status(404).send('Nenhum curso encontrado para as solicitações');
        }
        // Retornar a lista de cursos encontrados
        return res.json({ cursos });
    } catch (error) {
        console.error('Erro: ', error);
        return res.status(500).send({ message: 'Erro ao buscar cursos' });
    }
};
//visualizar soliticações em andamento
export const buscarSolicitacaoEmAndamentoCompras = async (req, res) => {
    const setorAtual = 'compras';
    const statusSolicitacao = 'em andamento';
    try {
        //
        const [result] = await db.query(`
            SELECT * FROM solicitacoes WHERE setor_atual = ? AND status = ?`, [setorAtual, statusSolicitacao]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'não há solicitações em andamento' })
        }
        //
        return res.json(result);
    } catch (error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({ error });
    }
}
export const buscarSolicitacaoConcluidasCompras = async (req, res) => {
    const setorAtual = 'compras';
    const statusSolicitacao = 'concluída';
    try {
        //
        const [result] = await db.query(`
            SELECT * FROM solicitacoes WHERE setor_atual = ? AND status = ?`, [setorAtual, statusSolicitacao]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'não há solicitações em andamento' })
        }
        //
        return res.json(result);
    } catch (error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({ error });
    }
}

export const atualizarSetorDaSolicitacao = async (req, res) => {
    const setorAtual = 'compras';
    const statusSolicitacao = 'em andamento';
    const proximoStatus = 'concluída'
    try {
        //
        const [ compras ] = await db.query(`
            SELECT * FROM solicitacoes WHERE setor_atual = ? AND status = ?`, [setorAtual, statusSolicitacao]);
        
        if(compras.length === 0) {
            return res.status(404).json({message: 'não há solicitações em andamento'})
        }
        //
        const result = await db.query (`
            UPDATE solicitacoes
            SET status = ?
            WHERE status = ? AND setor_atual = ?;
        `, [proximoStatus, statusSolicitacao, setorAtual])

        return res.json(result);
    } catch(error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({error});
    }
}
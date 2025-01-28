import db from '../config/db.js';

//GET

export const buscarCursosCompras = async (req, res) => {
    try {
        const [ result ] = await db.query('SELECT* FROM curso ORDER BY data_fim DESC');
        //
        if(result.length === 0) {
            res.statu(404).send('Nenhum curso')
            return {message: 'nenhum curso'};
        }
        //
        return res.json(result);
    } catch(error) {
        console.error('Erro: ', error);
        return {message: "Erro tropa"}
    }
}


//visualizar soliticações em andamento
export const buscarSolicitacaoEmAndamentoCompras = async (req, res) => {
    const setorAtual = 'compras';
    const statusSolicitacao = 'em andamento';
    try {
        //
        const [ result ] = await db.query(`
            SELECT * FROM solicitacoes WHERE setor_atual = ? AND status = ?`, [setorAtual, statusSolicitacao]);
        
        if(result.length === 0) {
            return res.status(404).json({message: 'não há solicitações em andamento'})
        }
        //
        return res.json(result);
    } catch(error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({error});
    }
}














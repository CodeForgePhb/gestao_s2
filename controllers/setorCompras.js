import db from '../config/db.js';

//GET

export const buscarSolicitacaoCompras = async (req, res) => {
    const [ result ] = await db.query(`SELECT* from solicitacoes`);
    //
    try {
        if(result.length === 0) {
            console.log('Nenhuma solicitação encontrada');
            return res.json({message: 'Sem solicitação'});
        }

        return res.json(result);

    } catch(error) {
        console.error('Erro na requisição', error);
        return {message: error.message};
    }
}














import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';


//visualizar soliticações em andamento
export const buscarSolicitacaoEmAndamentoGestao = async (req, res) => {
    const setorAtual = 'gestao';
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

export const buscarSolicitacaoEmCompras = async (req, res) => {
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
        return res.status(200).json(result)
    } catch(error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({error});
    }
}

//visualizar solicitacoes encaminhadas
export const atualizarSetorDaSolicitacao = async (req, res) => {
    const setorAtual = 'gestao';
    const statusSolicitacao = 'em andamento';
    const proximoSetor = 'compras'
    try {
        //
        const [ gestao ] = await db.query(`
            SELECT * FROM solicitacoes WHERE setor_atual = ? AND status = ?`, [setorAtual, statusSolicitacao]);
        
        if(gestao.length === 0) {
            return res.status(404).json({message: 'não há solicitações em andamento'})
        }
        //
        const result = await db.query (`
            UPDATE solicitacoes
            SET setor_atual = ?
            WHERE setor_atual = ?;
        `, [proximoSetor, setorAtual])

        return res.json(result);
    } catch(error) {
        console.error('erro encontrado: ', error);
        return res.status(500).json({error});
    }
}

// export const todasSolicitacoesGestaoConcluidas = async (req, res) => {
//     const status = 'concluída' || 'em andamento';
//     try {
//       //1.
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) {
//         return res.status(401).json({ message: 'Token não fornecido' })
//       }
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const { userId, nome } = decoded;
//       const result = await db.query(`SELECT numero_solicitacao FROM solicitacoes WHERE 
//         numero_solicitacao LIKE ? AND status = ?`, [`${userId}-${nome}%`, status]);
//       if (result.length === 0) {
//         return res.status(404).json([]);
//       }
//       console.log('Resultado da consulta (backend):', result);

//       return res.status(200).json(result); // Retorna o array completo no response
//     } catch (error) {
//       console.error('Erro ao buscar as solicitações.', error);
//       return res.status(500).json({ message: 'Erro ao buscar os dados.', error });
//     }
//   };
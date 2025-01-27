import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';
// ------------------------ ROTAS POST ------------------------
export const addCurso = async (req, res) => {
    const { nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim, cod, docente } = req.body;
    try {
        const [duplicidade] = await db.query(
            'SELECT * FROM curso WHERE nome = ? AND turma = ? AND data_inicio = ? AND data_fim = ? AND cod =?',
            [nome, turma, data_inicio, data_fim, cod]
        );
        if (duplicidade.length > 0) {
            return res.status(409).send('Curso duplicado.');
        }
        const [resultado] = await db.execute(
            `INSERT INTO curso (nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim, cod, docente) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim, cod, docente]
        );
        return res.status(201).json({message: 'Curso adicionado com sucesso!'});
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
export const addDocente = async (req, res) => {
    const { matricula, nome, email, telefone } = req.body;
    const senha = "000000";
    const setor = "docente";
    try {
        const [duplicidade] = await db.query(
            'SELECT * FROM docente WHERE matricula = ? AND nome = ? AND email = ? AND telefone = ?', [matricula, nome, email, telefone]
        );
        if (duplicidade.length > 0) {
            return res.status(409).json({message: 'Docente já cadastrado.'});
        }
        const [resultado] = await db.execute(
            `INSERT INTO docente (matricula, nome, email, senha, setor, telefone) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [matricula, nome, email, senha, setor, telefone]
        );
        return res.status(201).json({message: 'Docente adicionado com sucesso!'});
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
//inserir kit didático
// 3. Inserir kit didatico
export const adicionar_kit = async (req, res) => {
    const { cod_kit, nome_kit, tipo, curso } = req.body;
    try {
        const [duplicidade] = await db.query(
            'SELECT* FROM kit WHERE cod_kit = ? AND nome_kit = ? AND tipo = ? AND curso = ?', [cod_kit, nome_kit, tipo, curso]
        );
        if (duplicidade.length > 0) {
            return res.status(409).send('Kit já existe');
        }
        const [resultado] = await db.execute(
            `INSERT INTO kit (cod_kit, nome_kit, tipo, curso) 
            VALUES (?, ?, ?, ?)`,
            [cod_kit, nome_kit, tipo, curso]
        );
        return res.status(201).json({message: 'Kit adicionado com sucesso!'});
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
export const addMateriais = async (req, res) => {
    const { cod_produto, descricao, qnt_max, unidade_medida, saldo, cod_kit, nome_kit } = req.body;
    try {
        const [duplicidade] = await db.query(
            `SELECT * FROM materiais WHERE cod_produto = ? AND descricao = ? AND qnt_max = ? AND unidade_medida = ? 
            AND saldo = ? AND cod_kit = ? AND nome_kit = ?`,
            [cod_produto, descricao, qnt_max, unidade_medida, saldo, cod_kit, nome_kit]
        );
        if (duplicidade.length > 0) {
            return res.status(409).send('Material já existe');
        }
        const [resultado] = await db.query(
            `INSERT INTO materiais (cod_produto, descricao, qnt_max, unidade_medida, saldo, cod_kit, nome_kit) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cod_produto, descricao, qnt_max, unidade_medida, saldo, cod_kit, nome_kit]
        );
        return res.status(200).json({message: 'Material adicionado com sucesso!'});
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
// ------------------------ ROTAS GET ------------------------
export const buscarCursos = async (req, res) => {
    try {
        const [resultado] = await db.execute(`SELECT nome, matriculas_previstas, turno, ch_total, 
            modalidade, financiamento, localidade, turma, data_inicio, data_fim, cod, docente FROM curso`);
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Não há cursos.' });
        }
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
export const buscarCursosVigentes = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosVigentes()');
        const [resultado] = await db.execute('SELECT * FROM cursos_vigentes');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.o', error);
        return res.status(500).send('Erro ao processar a requisiçãoo.');
    }
};
export const buscarCursosConcluidos = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosConcluidos()'); // oque é isso elaine?
        const [resultado] = await db.execute('SELECT * FROM cursos_concluidos');
        console.log(resultado);
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
export const buscarDocentes = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            `SELECT matricula, nome, email, telefone FROM docente`
        );
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Não há docentes.' });
        }
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

//visualizar soliticações em andamento
export const buscarSolicitacaoEmAndamento = async (req, res) => {
    const setorAtual = 'coordenacao';
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

//visualizar solicitacoes encaminhadas
export const buscarSolicitacaoEncaminhada = async (req, res) => {
    const setorAtual = 'gestao' || 'setor de compras';
    
    try {
        const [ result ] = await db.query(`SELECT* from solicitacoes WHERE setor_atual = ?`, [setorAtual]);
    //
    if(result.length === 0) {
        console.log('Nenhuma solicitação existente');
        return res.status(404).json({message: 'nenhuma solicitação'})
    }
    console.log(result)
    return res.json(result);

    } catch(error) {
        console.error('Erro encontrado: ', error);
        return res.status(500).json({error});
    }
}


// VISUALIZAR KIT DIDÁTICOS
export const buscarKitCoordenacao = async (req, res) => {
    try {
        const [result] = await db.query('SELECT cod_kit, nome_kit, tipo, curso FROM kit')
        // Verifica se o array está vazio ou indefinido
        if (result.length === 0) {
            return res.status(404).json({ message: 'Não há kits.' });
        }
        // Retorna os kits encontrados
        //console.log(result); // Mostra todos os kits no console
        return res.status(200).json(result); // Retorna o array completo no response
    } catch (error) {
        console.error('ERRO ENCONTRADO: ', error);
        res.status(500).json({ message: 'Erro' })
    }
};
// ------------------------ ROTAS DELETE ------------------------
export const delDocente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('ID do docente é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM docente WHERE id = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Docente não encontrado.');
        }
        return res.status(200).json({ message: 'Docente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
export const delCursoVigente = async (req, res) => {
    try {
        const { id_curso } = req.params;
        if (!id_curso) {
            return res.status(400).send('ID do curso é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM cursos_vigentes WHERE id_curso = ?', [id_curso]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Curso vigente não encontrado.');
        }
        return res.status(200).json({ message: 'Curso vigente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
// ------------------------ EXPORTAÇÃO ------------------------
